import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

# 1. Connect to CoppeliaSim
client = RemoteAPIClient()
sim = client.getObject('sim')

# --- Parameters ---
# We'll use the 'Elbow' joint. From the list, its handle is 68.
# If the scene changes, you might need to get the handle by name instead:
# joint_name = 'Elbow'
# joint_handle = sim.getObject('./' + joint_name)

joint_handle = 68 
joint_name = "Elbow"

# --- Script ---
print("--- Starting Joint Control Script ---")

try:
    print(f"Successfully connected to the simulation.")
    print(f"Attempting to control joint: '{joint_name}' (Handle: {joint_handle})")

    # Get the initial position of the joint
    initial_position_rad = sim.getJointPosition(joint_handle)
    print(f"Initial position of '{joint_name}': {initial_position_rad:.2f} radians")

    # Define a few target angles (in radians)
    target_angles_rad = [initial_position_rad + 0.4, initial_position_rad - 0.4, initial_position_rad]

    # Move the joint to each target angle
    for i, angle_rad in enumerate(target_angles_rad):
        print(f"  -> Moving to position {i+1}: {angle_rad:.2f} radians...")
        sim.setJointTargetPosition(joint_handle, angle_rad)
        # Give the simulation time to execute the move
        time.sleep(2) 

    print(f"Movement sequence for '{joint_name}' completed.")

except Exception as e:
    print(f"An error occurred: {e}")
    print("Please ensure the simulation is running and the joint handle is correct.")

finally:
    print("--- Script finished ---")
