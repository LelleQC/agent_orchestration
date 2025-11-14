# oscillate_control.py
import time
import math
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

# --- Parameters ---
joint_handle = 82  # 'Elbow'
pos_control_param_id = 2001

# --- Oscillation Parameters ---
center_angle_deg = 90.0
amplitude_deg = 45.0  # Will move 45 degrees in each direction from the center
center_angle_rad = math.radians(center_angle_deg)
amplitude_rad = math.radians(amplitude_deg)

print(f"Starting continuous oscillation for joint handle: {joint_handle}")
print(f"Oscillating around {center_angle_deg} degrees with an amplitude of {amplitude_deg} degrees.")
print("Press Ctrl+C to stop.")

try:
    start_time = time.time()
    # --- Continuous Control Loop ---
    while True:
        # Calculate the new target angle using a sine wave for smooth oscillation
        elapsed_time = time.time() - start_time
        target_angle_rad = center_angle_rad + math.sin(elapsed_time) * amplitude_rad
        
        # 1. Forcefully disable the position controller
        sim.setObjectInt32Parameter(joint_handle, pos_control_param_id, 0)

        # 2. Forcefully set the new target position
        sim.setJointTargetPosition(joint_handle, target_angle_rad)
        
        # 3. Ensure it has enough force
        sim.setJointMaxForce(joint_handle, 100)

        # Optional: Print the current target to the console
        print(f"Current Target Angle: {math.degrees(target_angle_rad):.1f} degrees", end='\r')

        time.sleep(0.05)

except KeyboardInterrupt:
    print("\nLoop stopped by user.")
except Exception as e:
    print(f"\nAn error occurred: {e}")
finally:
    print("\nProgram finished")
