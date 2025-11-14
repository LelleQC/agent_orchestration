# disable_script_on_object.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

object_handle = 13

print(f"Attempting to disable script on object with handle: {object_handle}")

try:
    # Disable the script on the object
    sim.setObjectInt32Param(object_handle, sim.scriptintparam_enabled, 0)

    print("Script disabled. Checking status...")

    # Check the status of the script
    status = sim.getObjectInt32Param(object_handle, sim.scriptintparam_enabled)

    if status == 0:
        print("SUCCESS: Script is now disabled.")
    else:
        print("FAILURE: Script is still enabled.")

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')
