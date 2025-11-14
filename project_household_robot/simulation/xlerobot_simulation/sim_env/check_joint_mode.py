# check_joint_mode.py
import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

# Connect to CoppeliaSim
client = RemoteAPIClient()
sim = client.getObject('sim')

# Get the handle for the elbow joint (from previous debugging)
joint_handle = 82 # Corresponds to 'Elbow'

# Check if the joint handle is valid
try:
    # Get the object name to confirm we have the right handle
    obj_name = sim.getObjectAlias(joint_handle)
    print(f"Successfully connected. Checking joint with handle {joint_handle} ('{obj_name}').")
except Exception as e:
    print(f"Error: Could not get object alias for handle {joint_handle}. Is the simulation running?")
    print(f"Details: {e}")
    client.close()
    exit()

try:
    # --- This is the core of the investigation ---
    # We will read two important integer parameters for the joint.
    # These constants are defined by the CoppeliaSim API.

    # 1. Is the motor for the joint enabled?
    # sim.jointintparam_motor_enabled = 2000
    motor_enabled_param_id = 2000
    is_motor_enabled = sim.getObjectInt32Parameter(joint_handle, motor_enabled_param_id)

    # 2. Is the position controller for the joint enabled?
    # This is the most likely cause of the "snap-back" behavior.
    # sim.jointintparam_ctrl_enabled = 2001
    pos_control_enabled_param_id = 2001
    is_control_enabled = sim.getObjectInt32Parameter(joint_handle, pos_control_enabled_param_id)

    print("\n--- Joint Status ---")
    print(f"Motor enabled: {bool(is_motor_enabled)}")
    print(f"Position Control enabled: {bool(is_control_enabled)}")
    print("--------------------\n")

    if is_control_enabled:
        print("Hypothesis: 'Position Control enabled' is TRUE. This is very likely the cause of the snap-back.")
        print("The joint's internal controller is fighting our external commands, trying to force it back to its target position.")
    else:
        print("Hypothesis: 'Position Control enabled' is FALSE. The snap-back cause is something else.")

except Exception as e:
    print(f"\nAn error occurred while reading joint parameters: {e}")
    print("This might mean the parameter IDs (2000, 2001) are incorrect for this version.")

finally:
    # Clean up
    # client.close() # This was causing an error
    print('Program finished')
