# get_script_source_via_call.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

script_handle = 64
function_names_to_try = ["get_source", "getSource", "get_script", "getScript", "read", "read_script"]

print(f"Attempting to get source of script with handle: {script_handle}")

try:
    for func_name in function_names_to_try:
        print(f"  - Trying function: {func_name}@{sim.getObjectName(script_handle)}")
        try:
            result = sim.callScriptFunction(func_name + "@" + sim.getObjectName(script_handle), script_handle)
            if result:
                print(f"SUCCESS: Got script source via {func_name}")
                print("\n--- SCRIPT CONTENT ---")
                print(result)
                print("----------------------\n")
                break
        except Exception as e:
            print(f"    - Failed with error: {e}")
    else:
        print("\nFAILURE: Could not get script source with any of the tried function names.")


except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')
