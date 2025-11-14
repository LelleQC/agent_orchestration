# disable_control_mode.py
import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

# Connect to CoppeliaSim
client = RemoteAPIClient()
sim = client.getObject('sim')

# Joint handle and parameter ID from previous scripts
joint_handle = 82 # 'Elbow'
pos_control_enabled_param_id = 2001 # sim.jointintparam_ctrl_enabled

print(f"Attempting to disable position control for joint handle: {joint_handle}")

try:
    # --- Read the current state ---
    initial_state = sim.getObjectInt32Parameter(joint_handle, pos_control_enabled_param_id)
    print(f"Initial 'Position Control enabled' state: {bool(initial_state)}")

    if not initial_state:
        print("Position control is already disabled. No action needed.")
    else:
        # --- Disable the position controller ---
        print("Setting 'Position Control enabled' to FALSE (0)...")
        sim.setObjectInt32Parameter(joint_handle, pos_control_enabled_param_id, 0)
        
        # --- Verification ---
        # Wait a moment for the change to apply
        time.sleep(0.1) 
        
        print("Verifying the new state...")
        new_state = sim.getObjectInt32Parameter(joint_handle, pos_control_enabled_param_id)
        print(f"New 'Position Control enabled' state: {bool(new_state)}")

        if not new_state:
            print("\nSUCCESS: Position controller has been disabled.")
            print("You should now be able to control the joint without snap-back.")
        else:
            print("\nFAILURE: Failed to disable the position controller. The setting did not change.")

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')
