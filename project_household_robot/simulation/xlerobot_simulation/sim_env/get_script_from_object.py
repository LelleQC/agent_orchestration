# get_script_from_object.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

object_handle = 13

print(f"Attempting to get script content from object with handle: {object_handle}")

try:
    # Get the script content from the object
    script_content = sim.getObjectStringParam(object_handle, sim.scriptstringparam_text)

    if script_content:
        print("\n--- SCRIPT CONTENT ---")
        print(script_content)
        print("----------------------\n")
    else:
        print("\nFAILURE: Could not read script content. It might be empty or protected.")

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')
