import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient
import math

class RobotControl:
    def __init__(self):
        self.client = RemoteAPIClient()
        self.sim = self.client.getObject('sim')
        self.joint_handles = {}
        self.get_joint_handles()

    def get_joint_handles(self):
        """
        Gets and stores the handles for the robot's joints.
        """
        print("Getting joint handles...")
        # Joints for one arm
        self.joint_handles['arm_rotation'] = self.sim.getObjectHandle('Rotation')
        self.joint_handles['arm_pitch'] = self.sim.getObjectHandle('Pitch')
        self.joint_handles['arm_elbow'] = self.sim.getObjectHandle('Elbow')
        self.joint_handles['wrist_pitch'] = self.sim.getObjectHandle('Wrist_Pitch')
        self.joint_handles['wrist_roll'] = self.sim.getObjectHandle('Wrist_Roll')
        self.joint_handles['jaw'] = self.sim.getObjectHandle('Jaw')

        # Joints for the mobile base
        self.joint_handles['base_x'] = self.sim.getObjectHandle('root_x_axis_joint')
        self.joint_handles['base_y'] = self.sim.getObjectHandle('root_y_axis_joint')
        self.joint_handles['base_rotation'] = self.sim.getObjectHandle('root_z_rotation_joint')
        
        for name, handle in self.joint_handles.items():
            print(f"- Found {name}: {handle}")

    def set_joint_position(self, joint_name, position_degrees, max_force=100.0):
        """
        Sets the target position of a joint in degrees.
        """
        if joint_name not in self.joint_handles:
            print(f"Error: Joint '{joint_name}' not found.")
            return

        handle = self.joint_handles[joint_name]
        position_radians = math.radians(position_degrees)
        
        # As discovered in the initial project setup, we need to disable the control loop
        # and set a force to move the joints via API.
        self.sim.setObjectInt32Param(handle, self.sim.jointintparam_ctrl_enabled, 0)
        self.sim.setJointMaxForce(handle, max_force)
        self.sim.setJointTargetPosition(handle, position_radians)
        print(f"Setting {joint_name} to {position_degrees} degrees.")

    def get_joint_position(self, joint_name):
        """
        Gets the current position of a joint in degrees.
        """
        if joint_name not in self.joint_handles:
            print(f"Error: Joint '{joint_name}' not found.")
            return None

        handle = self.joint_handles[joint_name]
        position_radians = self.sim.getJointPosition(handle)
        position_degrees = math.degrees(position_radians)
        print(f"Current position of {joint_name}: {position_degrees:.2f} degrees.")
        return position_degrees

if __name__ == '__main__':
    # --- Example Usage ---
    robot = RobotControl()

    print("\n--- Testing Arm Joints ---")
    robot.set_joint_position('arm_elbow', 45)
    time.sleep(2)
    robot.get_joint_position('arm_elbow')
    time.sleep(1)
    robot.set_joint_position('arm_elbow', 0)
    time.sleep(2)
    robot.get_joint_position('arm_elbow')

    print("\n--- Testing Base Joints ---")
    # Note: Base joints are likely prismatic (linear) not revolute (rotational)
    # So setting 'degrees' might translate to meters.
    robot.set_joint_position('base_x', 0.1) # Move 0.1 meters on x-axis
    time.sleep(2)
    robot.get_joint_position('base_x')
    time.sleep(1)
    robot.set_joint_position('base_x', 0)
    time.sleep(2)
    robot.get_joint_position('base_x')

    print("\nScript finished.")
