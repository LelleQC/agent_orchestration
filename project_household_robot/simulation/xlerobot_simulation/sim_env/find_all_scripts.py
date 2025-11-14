# find_all_scripts.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

print("Searching for all scripts in the scene...")

try:
    # Get all objects in the scene by traversing the scene tree from its root.
    # sim.handle_scene should refer to the root of the scene.
    all_object_handles = sim.getObjectsInTree(sim.handle_scene, 10, 0)

    found_scripts = []

    print(f"Found {len(all_object_handles)} objects. Now checking each for associated scripts.")

    # Loop through every object handle
    for handle in all_object_handles:
        try:
            # Check for a "child script" associated with the object
            script_handle = sim.getScriptAssociatedWithObject(handle)
            
            if script_handle != -1 and script_handle is not None:
                obj_name = sim.getObjectAlias(handle)
                script_name = sim.getScriptName(script_handle)
                found_scripts.append({
                    "object_name": obj_name,
                    "object_handle": handle,
                    "script_name": script_name,
                    "script_handle": script_handle,
                    "type": "Child Script"
                })

            # Also check for "customization scripts"
            custom_script_handle = sim.getCustomizationScriptAssociatedWithObject(handle)
            if custom_script_handle != -1 and custom_script_handle is not None:
                obj_name = sim.getObjectAlias(handle)
                # Custom scripts often don't have a name, so we use their handle
                found_scripts.append({
                    "object_name": obj_name,
                    "object_handle": handle,
                    "script_name": f"Unnamed Custom Script",
                    "script_handle": custom_script_handle,
                    "type": "Customization Script"
                })

        except Exception as e:
            # Some objects might not be queriable, just note it and continue
            # print(f"Could not check object handle {handle}: {e}")
            pass

    if found_scripts:
        print("\n--- FOUND SCRIPTS ---")
        for script_info in found_scripts:
            print(f"Object: '{script_info['object_name']}' (Handle: {script_info['object_handle']})")
            print(f"  -> Script Type: {script_info['type']}")
            print(f"  -> Script Name: '{script_info['script_name']}' (Handle: {script_info['script_handle']})")
            print("-" * 20)
    else:
        print("\n--- No associated child or customization scripts found on any object. ---")


except Exception as e:
    print(f"\nAn error occurred during the search: {e}")

finally:
    print('Program finished')
