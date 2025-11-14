import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print("--- Starting Simple Joint Test ---")

# 1. Connect to CoppeliaSim
client = RemoteAPIClient()
sim = client.require('sim')

# The handle for the "Elbow" joint, which we corrected earlier.
ELBOW_HANDLE = 82 
# Set a reasonable maximum force for the motor
MAX_FORCE = 100.0

try:
    # Check if the simulation is running
    if sim.getSimulationState() == sim.simulation_stopped:
        print("Error: Simulation is not running in CoppeliaSim. Please press Play first.")
    else:
        print("Successfully connected. Simulation is running.")
        
        # 1. SET MAX FORCE - This is the new crucial step
        print(f"Setting max force for Elbow joint to: {MAX_FORCE}")
        sim.setJointMaxForce(ELBOW_HANDLE, MAX_FORCE)
        time.sleep(0.1) # Give a moment for the setting to apply

        # 2. GET INITIAL POSITION
        initial_pos = sim.getJointPosition(ELBOW_HANDLE)
        print(f"Initial Elbow Position: {initial_pos:.2f} radians")

        # 3. SET TARGET POSITION
        target_pos = 1.0  # 1.0 radian (about 57 degrees)
        print(f"Moving Elbow to: {target_pos} radians")
        sim.setJointTargetPosition(ELBOW_HANDLE, target_pos)
        
        # Give it time to move
        time.sleep(3)

        # 4. CHECK FINAL POSITION
        final_pos = sim.getJointPosition(ELBOW_HANDLE)
        print(f"Final Elbow Position: {final_pos:.2f} radians")

        if abs(final_pos - initial_pos) > 0.1:
            print("SUCCESS: The joint has moved!")
        else:
            print("FAILURE: The joint did not move. The root cause is still unknown.")

except Exception as e:
    print(f"\nAn error occurred: {e}")

print("\n--- Test Finished ---")
