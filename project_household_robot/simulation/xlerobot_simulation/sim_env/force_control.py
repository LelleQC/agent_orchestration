# force_control.py
import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient
import math

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

# --- Parameters ---
joint_handle = 82  # 'Elbow'
pos_control_param_id = 2001
target_angle_deg = 90.0  # Target angle in degrees
target_angle_rad = math.radians(target_angle_deg)

print(f"Starting continuous control loop for joint handle: {joint_handle}")
print(f"Targeting {target_angle_deg} degrees ({target_angle_rad:.2f} radians).")
print("Press Ctrl+C to stop.")

try:
    # Get the initial position to see if it changes
    initial_pos = sim.getJointPosition(joint_handle)
    print(f"Initial joint position: {initial_pos:.2f} radians")

    # --- Continuous Control Loop ---
    while True:
        # 1. Forcefully disable the position controller in every loop iteration
        sim.setObjectInt32Parameter(joint_handle, pos_control_param_id, 0)

        # 2. Forcefully set the target position in every loop iteration
        sim.setJointTargetPosition(joint_handle, target_angle_rad)
        
        # Optional: Also set a high force to make sure it can move
        sim.setJointMaxForce(joint_handle, 100)

        # Small delay to prevent overwhelming the simulator
        time.sleep(0.05)  # Loop roughly 20 times per second

except KeyboardInterrupt:
    print("\nLoop stopped by user.")

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    # As a safety measure, try to reset the force when the script ends
    try:
        print("Resetting joint force.")
        sim.setJointMaxForce(joint_handle, 10) # Reset to a default value
    except Exception as e:
        print(f"Could not reset joint force: {e}")
    
    print('Program finished')
