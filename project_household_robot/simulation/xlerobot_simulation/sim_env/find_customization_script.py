# find_customization_script.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

joint_handle = 79

print(f"Attempting to find customization script associated with object handle: {joint_handle}")

try:
    # Get the customization script associated with the object
    script_handle = sim.getCustomizationScriptAssociatedWithObject(joint_handle)

    if script_handle == -1 or script_handle is None:
        print(f"\nFAILURE: Could not find a customization script associated with object handle {joint_handle}.")
    else:
        print(f"SUCCESS: Found customization script with handle: {script_handle}")
        
        # 2. Get the script's code using its handle
        print("Attempting to read its content...")
        script_content = sim.getScriptText(script_handle)

        if script_content:
            print("\n--- SCRIPT CONTENT ---")
            print(script_content)
            print("----------------------\n")
        else:
            print("\nFAILURE: Found the script handle, but could not read its content. It might be empty or protected.")

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')
