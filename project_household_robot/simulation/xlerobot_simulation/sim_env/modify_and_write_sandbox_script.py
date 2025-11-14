# modify_and_write_sandbox_script.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient
import os

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

# Get the absolute path to the modified lua script
modified_script_path = os.path.abspath('project_household_robot/simulation/xlerobot_simulation/sim_env/sandboxScript_modified.lua')
# The path needs to be in a format that lua can understand, so we replace backslashes with forward slashes
modified_script_path = modified_script_path.replace('\\', '/')


print("Attempting to modify the sandbox script...")

try:
    # Get the sandbox script handle
    script_handle = sim.getScript(sim.scripttype_sandboxscript)

    if script_handle == -1 or script_handle is None:
        print("\nFAILURE: Could not find a sandbox script.")
    else:
        print(f"SUCCESS: Found sandbox script with handle: {script_handle}")
        
        # Get the script's code using its handle
        print("Attempting to read its content...")
        original_content = sim.getScriptStringParam(script_handle, sim.scriptstringparam_text)

        if original_content:
            print("Original content read successfully.")
            
            # Modify the content
            modified_content = f"#python\n\n#luaExec require('{modified_script_path}')\n\n#Python runs just so that we have _evalExec and similar\n\ndef sysCall_init():\n    sim = require('sim')\n"
            
            # Write the modified content back
            print("Attempting to write the modified content back...")
            sim.setScriptStringParam(script_handle, sim.scriptstringparam_text, modified_content)
            print("Modified content written successfully.")

            # Verify the change
            print("Verifying the change...")
            new_content = sim.getScriptStringParam(script_handle, sim.scriptstringparam_text)
            if new_content == modified_content:
                print("SUCCESS: The sandbox script has been modified to load the debug script.")
                print("Please restart the simulation and provide the console output.")
                
                # Create a script to revert the changes
                revert_script_content = f"#python\n\n#luaExec require('sandboxScript')\n\n#Python runs just so that we have _evalExec and similar\n\ndef sysCall_init():\n    sim = require('sim')\n"
                with open('project_household_robot/simulation/xlerobot_simulation/sim_env/revert_sandbox_script.py', 'w') as f:
                    f.write(f"""# revert_sandbox_script.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

print(\"Attempting to revert the sandbox script...\")

try:
    script_handle = sim.getScript(sim.scripttype_sandboxscript)
    if script_handle != -1:
        sim.setScriptStringParam(script_handle, sim.scriptstringparam_text, '''{revert_script_content}''')
        print(\"SUCCESS: The sandbox script has been reverted to its original state.\")
    else:
        print(\"FAILURE: Could not find the sandbox script.\")
except Exception as e:
    print(f\"An error occurred: {{e}}\")
finally:
    print('Program finished')
""")
                print("A script to revert the changes has been created: revert_sandbox_script.py")

            else:
                print("FAILURE: The sandbox script could not be modified.")

        else:
            print("\nFAILURE: Found the script handle, but could not read its content. It might be empty or protected.")

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')