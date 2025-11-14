# get_script_content.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

script_handle = 13

print(f"Attempting to read the content of script with handle: {script_handle}")

try:
    # Get the script's code using its handle
    print("Attempting to read its content...")
    script_content = sim.getScriptText(script_handle)

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
