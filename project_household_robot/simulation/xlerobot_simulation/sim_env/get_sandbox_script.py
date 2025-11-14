# get_sandbox_script.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

print("Attempting to get the sandbox script...")

try:
    # Get the sandbox script handle
    script_handle = sim.getScript(sim.scripttype_sandboxscript)

    if script_handle == -1 or script_handle is None:
        print("\nFAILURE: Could not find a sandbox script.")
    else:
        print(f"SUCCESS: Found sandbox script with handle: {script_handle}")
        
        # Get the script's code using its handle
        print("Attempting to read its content...")
        script_content = sim.getScriptStringParam(script_handle, sim.scriptstringparam_text)

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
