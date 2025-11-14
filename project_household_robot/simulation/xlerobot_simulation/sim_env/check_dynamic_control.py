# check_dynamic_control.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

joint_handle = 82 # 'Elbow'

try:
    obj_name = sim.getObjectAlias(joint_handle)
    print(f"Checking properties for joint handle: {joint_handle} ('{obj_name}')")

    # --- Check if the joint's dynamic properties can be controlled via script ---
    # This function checks the "Dynamically controllable" property in the UI.
    is_controllable = sim.isDynamicallyEnabled(joint_handle)

    print("\n--- Dynamic Control Status ---")
    print(f"Is dynamically controllable: {is_controllable}")
    print("------------------------------\n")

    if not is_controllable:
        print("HYPOTHESIS: The joint is NOT dynamically controllable.")
        print("This is likely why we cannot disable the position controller via the API.")
        print("This property must be changed in the CoppeliaSim UI itself.")
    else:
        print("HYPOTHESIS: The joint IS dynamically controllable.")
        print("The reason we cannot change the parameter lies elsewhere.")

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')
