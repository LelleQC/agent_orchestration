import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient
import math

class JointDebugger:
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
        self.joint_handles['arm_elbow'] = self.sim.getObjectHandle('Elbow')
        self.joint_handles['base_x'] = self.sim.getObjectHandle('root_x_axis_joint')
        self.joint_handles['base_y'] = self.sim.getObjectHandle('root_y_axis_joint')
        self.joint_handles['base_rotation'] = self.sim.getObjectHandle('root_z_rotation_joint')
        print("Handles obtained.")

    def debug_joint(self, joint_name):
        """
        Prints debugging information for a specific joint.
        """
        if joint_name not in self.joint_handles:
            print(f"Error: Joint '{joint_name}' not found.")
            return

        handle = self.joint_handles[joint_name]
        print(f"\n--- Debugging Joint: {joint_name} (Handle: {handle}) ---")

        # 1. Get Joint Type
        joint_type = self.sim.getJointType(handle)
        type_str = "Unknown"
        if joint_type == self.sim.joint_revolute_subtype:
            type_str = "Revolute (Rotational)"
        elif joint_type == self.sim.joint_prismatic_subtype:
            type_str = "Prismatic (Linear)"
        elif joint_type == self.sim.joint_spherical_subtype:
            type_str = "Spherical"
        print(f"Type: {type_str} ({joint_type})")

        # 2. Get Joint Interval (Limits)
        can_be_set, interval = self.sim.getJointInterval(handle)
        if can_be_set:
            if joint_type == self.sim.joint_revolute_subtype:
                # For revolute joints, interval is in radians
                min_angle = math.degrees(interval[0])
                max_angle = math.degrees(interval[1])
                print(f"Limits: Min={min_angle:.2f} deg, Max={max_angle:.2f} deg")
            else:
                # For prismatic joints, interval is in meters
                print(f"Limits: Min={interval[0]:.2f} m, Max={interval[1]:.2f} m")
        else:
            print("Limits: Not defined or dynamic.")
            
        # 3. Get Current Position
        position = self.sim.getJointPosition(handle)
        if joint_type == self.sim.joint_revolute_subtype:
            print(f"Current Position: {math.degrees(position):.2f} deg")
        else:
            print(f"Current Position: {position:.4f} m")


if __name__ == '__main__':
    debugger = JointDebugger()
    
    debugger.debug_joint('arm_elbow')
    debugger.debug_joint('base_x')
    debugger.debug_joint('base_y')
    debugger.debug_joint('base_rotation')

    print("\n--- Trying Velocity Control on Base ---")
    base_x_handle = debugger.joint_handles['base_x']
    
    # Ensure the joint is in a mode that accepts velocity commands
    debugger.sim.setObjectInt32Param(base_x_handle, debugger.sim.jointintparam_ctrl_enabled, 0)
    
    print("Setting target velocity for 'base_x' to 0.1 m/s for 2 seconds...")
    debugger.sim.setJointTargetVelocity(base_x_handle, 0.1)
    time.sleep(2)
    
    print("Stopping 'base_x'...")
    debugger.sim.setJointTargetVelocity(base_x_handle, 0)
    time.sleep(1)
    
    # Check final position
    debugger.debug_joint('base_x')

    print("\nScript finished.")
