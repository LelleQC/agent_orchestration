# find_main_script.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

script_names_to_try = ["main", "MainScript", "Main", "main_script", "Main_Script"]

print(f"Attempting to find main script by name...")

try:
    for name in script_names_to_try:
        print(f"  - Trying name: {name}")
        script_handle = sim.getScriptHandle(name)

        if script_handle != -1 and script_handle is not None:
            print(f"SUCCESS: Found script '{name}' with handle: {script_handle}")
            
            # 2. Get the script's code using its handle
            print("Attempting to read its content...")
            script_content = sim.getScriptText(script_handle)

            if script_content:
                print("\n--- SCRIPT CONTENT ---")
                print(script_content)
                print("----------------------\n")
            else:
                print("\nFAILURE: Found the script handle, but could not read its content. It might be empty or protected.")
            
            break # Exit the loop if we found a script
    else:
        print("\nFAILURE: Could not find a main script with any of the tried names.")

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')
