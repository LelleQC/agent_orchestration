import os
import time
import math
import cv2
import numpy as np
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

class Robot:
    """
    A unified class to control the XLeRobot in CoppeliaSim,
    handling camera, arm, and base control.
    """
    def __init__(self):
        print("Initializing Robot...")
        self.client = RemoteAPIClient()
        self.sim = self.client.getObject('sim')
        self.original_sandbox_content = None
        self.joint_handles = {}
        self.camera_frame_handle = None

        self._patch_simulation_scripts()
        self._get_handles()
        print("Robot Initialized Successfully.")

    def _patch_simulation_scripts(self):
        """
        Patches the main sandbox script to disable the default joint handling
        that interferes with remote API control.
        """
        print("Patching simulation sandbox script...")
        try:
            script_handle = self.sim.getScript(self.sim.scripttype_sandboxscript)
            if script_handle == -1:
                raise RuntimeError("Could not find the sandbox script.")

            self.original_sandbox_content = self.sim.getScriptStringParam(script_handle, self.sim.scriptstringparam_text)
            
            modified_script_path = os.path.abspath('project_household_robot/simulation/xlerobot_simulation/sim_env/sandboxScript_modified.lua')
            modified_script_path = modified_script_path.replace('\\', '/')
            
            # This new content effectively hijacks the sandbox script to run our modified version.
            # The modified lua script should have the sim.handleJointMotion() call commented out.
            modified_content = f"#python\n\n#luaExec require('{modified_script_path}')\n"

            self.sim.setScriptStringParam(script_handle, self.sim.scriptstringparam_text, modified_content)
            print("Sandbox script patched.")
            # Give the simulation a moment to load the new script
            time.sleep(0.5)

        except Exception as e:
            print(f"FATAL: Failed to patch simulation script: {e}")
            raise

    def _get_handles(self):
        """
        Gets and stores the handles for the robot's joints and camera frame.
        """
        print("Getting object handles...")
        try:
            # Joints
            self.joint_handles['arm_rotation'] = self.sim.getObjectHandle('Rotation')
            self.joint_handles['arm_pitch'] = self.sim.getObjectHandle('Pitch')
            self.joint_handles['arm_elbow'] = self.sim.getObjectHandle('Elbow')
            self.joint_handles['wrist_pitch'] = self.sim.getObjectHandle('Wrist_Pitch')
            self.joint_handles['wrist_roll'] = self.sim.getObjectHandle('Wrist_Roll')
            self.joint_handles['jaw'] = self.sim.getObjectHandle('Jaw')
            self.joint_handles['base_x'] = self.sim.getObjectHandle('root_x_axis_joint')
            self.joint_handles['base_y'] = self.sim.getObjectHandle('root_y_axis_joint')
            self.joint_handles['base_rotation'] = self.sim.getObjectHandle('root_z_rotation_joint')
            
            # Camera
            self.camera_frame_handle = self.sim.getObjectHandle('head_camera_rgb_optical_frame_visual')

            print("All handles acquired.")
        except Exception as e:
            print(f"FATAL: Failed to get object handles: {e}")
            raise

    def get_image(self, resolution=(640, 480)):
        """
        Creates a temporary vision sensor, captures an image, and returns it.
        """
        vision_sensor_handle = -1
        try:
            options = 2  # Perspective
            int_params = [resolution[0], resolution[1], 0, 0]
            float_params = [0.1, 10.0, 60.0 * (math.pi / 180.0), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
            vision_sensor_handle = self.sim.createVisionSensor(options, int_params, float_params)
            
            self.sim.setObjectParent(vision_sensor_handle, self.camera_frame_handle, True)
            time.sleep(0.1)

            img, resX, resY = self.sim.getVisionSensorCharImage(vision_sensor_handle)
            
            if not img:
                return None

            image_byte_array = bytearray(img)
            numpy_image = np.array(image_byte_array, dtype=np.uint8).reshape((resY, resX, 3))
            numpy_image = cv2.flip(numpy_image, 0)
            bgr_image = cv2.cvtColor(numpy_image, cv2.COLOR_RGB2BGR)
            return bgr_image

        finally:
            if vision_sensor_handle != -1:
                self.sim.removeObject(vision_sensor_handle)

    def set_joint_position(self, joint_name, position_degrees, max_force=50.0):
        """
        Sets the target position of a revolute joint in degrees.
        """
        if joint_name not in self.joint_handles:
            print(f"Warning: Joint '{joint_name}' not found.")
            return

        handle = self.joint_handles[joint_name]
        position_radians = math.radians(position_degrees)
        
        self.sim.setObjectInt32Param(handle, self.sim.jointintparam_ctrl_enabled, 1) # Enable control
        self.sim.setJointMaxForce(handle, max_force)
        self.sim.setJointTargetPosition(handle, position_radians)

    def set_base_velocity(self, vx=0.0, vy=0.0, v_rot_deg_s=0.0, force=100.0):
        """
        Sets the target velocity of the mobile base joints.
        vx, vy: linear velocity in m/s
        v_rot_deg_s: rotational velocity in degrees/s
        """
        # Base X (Prismatic)
        self.sim.setJointMaxForce(self.joint_handles['base_x'], force)
        self.sim.setJointTargetVelocity(self.joint_handles['base_x'], vx)
        
        # Base Y (Prismatic)
        self.sim.setJointMaxForce(self.joint_handles['base_y'], force)
        self.sim.setJointTargetVelocity(self.joint_handles['base_y'], vy)

        # Base Rotation (Revolute)
        v_rot_rad_s = math.radians(v_rot_deg_s)
        self.sim.setJointMaxForce(self.joint_handles['base_rotation'], force)
        self.sim.setJointTargetVelocity(self.joint_handles['base_rotation'], v_rot_rad_s)

    def shutdown(self):
        """
        Reverts the sandbox script to its original state.
        """
        print("Shutting down robot and reverting simulation scripts...")
        if self.original_sandbox_content:
            try:
                script_handle = self.sim.getScript(self.sim.scripttype_sandboxscript)
                if script_handle != -1:
                    self.sim.setScriptStringParam(script_handle, self.sim.scriptstringparam_text, self.original_sandbox_content)
                    print("Sandbox script reverted.")
            except Exception as e:
                print(f"Warning: Failed to revert sandbox script: {e}")
        
        # Stop any lingering movement
        self.set_base_velocity(0, 0, 0)
        print("Robot shutdown complete.")
