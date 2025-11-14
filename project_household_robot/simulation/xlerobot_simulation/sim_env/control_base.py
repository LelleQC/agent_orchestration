import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

# 1. Connect to CoppeliaSim
client = RemoteAPIClient()
sim = client.getObject('sim')

# --- Main Script ---
def run_drive_demo():
    """
    Runs a demonstration of the robot base's movement.
    """
    print("--- Starting Base Drive Demo ---")
    
    try:
        print("Successfully connected to the simulation.")

        # Find all joint objects in the scene
        all_joints = []
        scene_handle = sim.handle_scene
        all_object_type = sim.handle_all
        objs = sim.getObjectsInTree(scene_handle, all_object_type, 0)

        for h in objs:
            try:
                obj_type = sim.getObjectType(h)
                if obj_type == sim.object_joint_type:
                    all_joints.append(h)
            except Exception:
                pass # Ignore errors for non-objects

        print(f"Found {len(all_joints)} joint objects in the scene.")
        if not all_joints:
            print("No joint objects found. Cannot control base movement.")
            return

        # Attempt to control all joints
        drive_speed = 2.0 # radians/second
        
        print("\nAttempting to set target velocity for all joints...")
        for joint_handle in all_joints:
            try:
                joint_name = sim.getObjectAlias(joint_handle)
                # Disable position control and set max force for each joint
                sim.setObjectInt32Parameter(joint_handle, sim.jointintparam_ctrl_enabled, 0) # 0 for False
                sim.setJointMaxForce(joint_handle, 100) # Set a high enough force
                sim.setJointTargetVelocity(joint_handle, drive_speed)
                print(f"Set joint '{joint_name}' (Handle: {joint_handle}) target velocity to {drive_speed}")
            except Exception as e:
                print(f"Could not control joint {joint_handle} ('{joint_name if 'joint_name' in locals() else 'N/A'}'): {e}")
        
        time.sleep(5) # Drive for 5 seconds

        # --- Stop ---
        print("\nStopping all joints...")
        for joint_handle in all_joints:
            try:
                joint_name = sim.getObjectAlias(joint_handle)
                sim.setJointTargetVelocity(joint_handle, 0.0)
                print(f"Set joint '{joint_name}' (Handle: {joint_handle}) target velocity to 0.0")
            except Exception as e:
                print(f"Could not stop joint {joint_handle} ('{joint_name if 'joint_name' in locals() else 'N/A'}'): {e}")
        
        time.sleep(2)

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        print("Please ensure the simulation is running.")

    finally:
        print("\n--- Demo Finished ---")
if __name__ == "__main__":
    run_drive_demo()