import os
import time
import math
import cv2
import numpy as np
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

# Global client and sim objects
client = None
sim = None
original_sandbox_content = None
joint_handles = {}
camera_frame_handle = None

def initialize_robot():
    """
    Initializes the connection to the CoppeliaSim robot and patches the simulation script.
    """
    global client, sim, original_sandbox_content, joint_handles, camera_frame_handle
    
    if client:
        print("Robot already initialized.")
        return

    print("Initializing Robot...")
    client = RemoteAPIClient()
    sim = client.getObject('sim')

    _patch_simulation_scripts()
    _get_handles()
    print("Robot Initialized Successfully.")

def _patch_simulation_scripts():
    """
    Patches the main sandbox script to disable the default joint handling.
    """
    global sim, original_sandbox_content
    print("Patching simulation sandbox script...")
    try:
        script_handle = sim.getScript(sim.scripttype_sandboxscript)
        if script_handle == -1:
            raise RuntimeError("Could not find the sandbox script.")

        original_sandbox_content = sim.getScriptStringParam(script_handle, sim.scriptstringparam_text)
        
        modified_script_path = os.path.abspath('project_household_robot/simulation/xlerobot_simulation/sim_env/sandboxScript_modified.lua')
        modified_script_path = modified_script_path.replace('\\', '/')
        
        modified_content = "#python\n\n#luaExec require('" + modified_script_path + "')\n"

        sim.setScriptStringParam(script_handle, sim.scriptstringparam_text, modified_content)
        print("Sandbox script patched.")
        time.sleep(0.5)

    except Exception as e:
        print(f"FATAL: Failed to patch simulation script: {e}")
        raise

def _get_handles():
    """
    Gets and stores the handles for the robot's joints and camera frame.
    """
    global sim, joint_handles, camera_frame_handle
    print("Getting object handles...")
    try:
        joint_handles['arm_rotation'] = sim.getObjectHandle('Rotation')
        joint_handles['arm_pitch'] = sim.getObjectHandle('Pitch')
        joint_handles['arm_elbow'] = sim.getObjectHandle('Elbow')
        joint_handles['wrist_pitch'] = sim.getObjectHandle('Wrist_Pitch')
        joint_handles['wrist_roll'] = sim.getObjectHandle('Wrist_Roll')
        joint_handles['jaw'] = sim.getObjectHandle('Jaw')
        joint_handles['base_x'] = sim.getObjectHandle('root_x_axis_joint')
        joint_handles['base_y'] = sim.getObjectHandle('root_y_axis_joint')
        joint_handles['base_rotation'] = sim.getObjectHandle('root_z_rotation_joint')
        
        camera_frame_handle = sim.getObjectHandle('head_camera_rgb_optical_frame_visual')

        print("All handles acquired.")
    except Exception as e:
        print(f"FATAL: Failed to get object handles: {e}")
        raise

def get_robot_image(resolution=(640, 480)):
    """
    Creates a temporary vision sensor, captures an image, and returns it.
    """
    global sim, camera_frame_handle
    if not sim:
        initialize_robot()

    vision_sensor_handle = -1
    try:
        options = 2
        int_params = [resolution[0], resolution[1], 0, 0]
        float_params = [0.1, 10.0, 60.0 * (math.pi / 180.0), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        vision_sensor_handle = sim.createVisionSensor(options, int_params, float_params)
        
        sim.setObjectParent(vision_sensor_handle, camera_frame_handle, True)
        time.sleep(0.1)

        img, resX, resY = sim.getVisionSensorCharImage(vision_sensor_handle)
        
        if not img:
            return None

        image_byte_array = bytearray(img)
        numpy_image = np.array(image_byte_array, dtype=np.uint8).reshape((resY, resX, 3))
        numpy_image = cv2.flip(numpy_image, 0)
        bgr_image = cv2.cvtColor(numpy_image, cv2.COLOR_RGB2BGR)
        return bgr_image

    finally:
        if vision_sensor_handle != -1:
            sim.removeObject(vision_sensor_handle)

def set_robot_joint_position(joint_name, position_degrees, max_force=50.0):
    """
    Sets the target position of a revolute joint in degrees.
    """
    global sim, joint_handles
    if not sim:
        initialize_robot()

    if joint_name not in joint_handles:
        print(f"Warning: Joint '{joint_name}' not found.")
        return

    handle = joint_handles[joint_name]
    position_radians = math.radians(position_degrees)
    
    sim.setObjectInt32Param(handle, sim.jointintparam_ctrl_enabled, 1)
    sim.setJointMaxForce(handle, max_force)
    sim.setJointTargetPosition(handle, position_radians)

def set_robot_base_velocity(vx=0.0, vy=0.0, v_rot_deg_s=0.0, force=100.0):
    """
    Sets the target velocity of the mobile base joints.
    """
    global sim, joint_handles
    if not sim:
        initialize_robot()

    sim.setJointMaxForce(joint_handles['base_x'], force)
    sim.setJointTargetVelocity(joint_handles['base_x'], vx)
    
    sim.setJointMaxForce(joint_handles['base_y'], force)
    sim.setJointTargetVelocity(joint_handles['base_y'], vy)

    v_rot_rad_s = math.radians(v_rot_deg_s)
    sim.setJointMaxForce(joint_handles['base_rotation'], force)
    sim.setJointTargetVelocity(joint_handles['base_rotation'], v_rot_rad_s)

def shutdown_robot():
    """
    Reverts the sandbox script to its original state and stops the robot.
    """
    global sim, original_sandbox_content
    if not sim:
        return

    print("Shutting down robot and reverting simulation scripts...")
    if original_sandbox_content:
        try:
            script_handle = sim.getScript(sim.scripttype_sandboxscript)
            if script_handle != -1:
                sim.setScriptStringParam(script_handle, sim.scriptstringparam_text, original_sandbox_content)
                print("Sandbox script reverted.")
        except Exception as e:
            print(f"Warning: Failed to revert sandbox script: {e}")
    
    set_robot_base_velocity(0, 0, 0)
    print("Robot shutdown complete.")

if __name__ == '__main__':
    # Example usage
    try:
        initialize_robot()
        
        print("--- Testing Camera ---")
        image = get_robot_image()
        if image is not None:
            file_path = 'robot_tool_test_camera_output.png'
            cv2.imwrite(file_path, image)
            print(f"Camera test successful. Image saved to {file_path}")
        else:
            print("Camera test failed. No image received.")

        print("\n--- Testing Arm ---")
        print("Moving elbow to 45 degrees...")
        set_robot_joint_position('arm_elbow', 45)
        time.sleep(2)
        print("Moving elbow back to 0 degrees...")
        set_robot_joint_position('arm_elbow', 0)
        time.sleep(2)
        print("Arm test complete.")

        print("\n--- Testing Base ---")
        print("Moving base forward (vx=0.05) for 2 seconds...")
        set_robot_base_velocity(vx=0.05)
        time.sleep(2)
        print("Stopping base...")
        set_robot_base_velocity(vx=0.0)
        time.sleep(1)
        
    finally:
        shutdown_robot()
