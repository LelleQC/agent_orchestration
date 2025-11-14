# find_main_and_sandbox_scripts.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

def find_and_print_scripts(script_type, type_name):
    print(f"--- Finding scripts of type: {type_name} ---")
    try:
        script_handles = sim.getObjectsInTree(sim.handle_scene, script_type, 0)

        if not script_handles:
            print(f"No {type_name} scripts found.")
        else:
            print(f"Found {len(script_handles)} {type_name} script(s).")
            for sh in script_handles:
                name = sim.getObjectAlias(sh, -1)
                print(f"  - Script Handle: {sh}, Name: {name}")
                
                print("    Attempting to read its content...")
                script_content = sim.getScriptText(sh)

                if script_content:
                    print("\n--- SCRIPT CONTENT ---")
                    print(script_content)
                    print("----------------------\n")
                else:
                    print("    Could not read script content.")
    except Exception as e:
        print(f"An error occurred while searching for {type_name} scripts: {e}")

if __name__ == "__main__":
    find_and_print_scripts(sim.scripttype_mainscript, "Main")
    find_and_print_scripts(sim.scripttype_sandboxscript, "Sandbox")
    find_and_print_scripts(sim.scripttype_childscript, "Child")
    find_and_print_scripts(sim.scripttype_customizationscript, "Customization")
    find_and_print_scripts(sim.scripttype_addonscript, "Add-on")

    print('Program finished')
