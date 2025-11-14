import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

# 1. Connect to CoppeliaSim
client = RemoteAPIClient()
sim = client.getObject('sim')

# 2. Define the robot's arm joints by their handles
# These were identified from the list_objects.py output.
ARM_JOINTS = {
    "Rotation": 76,
    "Pitch": 79,
    "Elbow": 82,
    "Wrist_Pitch": 85,
    "Wrist_Roll": 88,
    "Jaw": 91
}

# --- Main Script ---
def run_movement_demo():
    """
    Runs a demonstration of the robot arm's movement.
    """
    print("--- Starting Full Arm Control Demo ---")
    
    try:
        print("Successfully connected to the simulation.")
        print("Identified Arm Joints:", list(ARM_JOINTS.keys()))

        # Disable position control and set max force for each joint
        for joint_name, joint_handle in ARM_JOINTS.items():
            sim.setObjectInt32Parameter(joint_handle, sim.jointintparam_ctrl_enabled, 0) # 0 for False
            sim.setJointMaxForce(joint_handle, 100) # Set a high enough force
            print(f"Disabled position control and set max force for {joint_name} (Handle: {joint_handle})")

        # --- Part 1: "Wake up" sequence ---
        print("\nPart 1: Running 'Wake Up' sequence...")
        # Move joints one by one to a starting position
        sim.setJointTargetPosition(ARM_JOINTS["Pitch"], -0.5)
        time.sleep(1.5)
        sim.setJointTargetPosition(ARM_JOINTS["Elbow"], 1.0)
        time.sleep(1.5)
        sim.setJointTargetPosition(ARM_JOINTS["Wrist_Pitch"], -0.5)
        time.sleep(1.5)
        print("'Wake Up' sequence complete.")

        # --- Part 2: "Dance" sequence ---
        print("\nPart 2: Running 'Dance' sequence...")
        for i in range(3):
            print(f"  Dance cycle {i+1}/3")
            # Wave the arm
            sim.setJointTargetPosition(ARM_JOINTS["Rotation"], 0.7)
            time.sleep(1)
            sim.setJointTargetPosition(ARM_JOINTS["Rotation"], -0.7)
            time.sleep(1)
        sim.setJointTargetPosition(ARM_JOINTS["Rotation"], 0) # Return to center
        time.sleep(1)
        print("'Dance' sequence complete.")

        # --- Part 3: Open and Close Jaw ---
        print("\nPart 3: Testing Jaw...")
        # Note: Jaw limits are often small.
        print("  Opening Jaw...")
        sim.setJointTargetPosition(ARM_JOINTS["Jaw"], 0.02) # Assuming a small value opens it
        time.sleep(2)
        print("  Closing Jaw...")
        sim.setJointTargetPosition(ARM_JOINTS["Jaw"], 0.0) # Assuming 0 is closed
        time.sleep(2)
        print("Jaw test complete.")

        # --- Part 4: Return to a neutral position ---
        print("\nPart 4: Returning to neutral position...")
        sim.setJointTargetPosition(ARM_JOINTS["Pitch"], 0)
        sim.setJointTargetPosition(ARM_JOINTS["Elbow"], 0)
        sim.setJointTargetPosition(ARM_JOINTS["Wrist_Pitch"], 0)
        sim.setJointTargetPosition(ARM_JOINTS["Rotation"], 0)
        time.sleep(2)
        print("Arm is in neutral position.")

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        print("Please ensure the simulation is running and the joint handles are correct.")

    finally:
        print("\n--- Demo Finished ---")

if __name__ == "__main__":
    run_movement_demo()
