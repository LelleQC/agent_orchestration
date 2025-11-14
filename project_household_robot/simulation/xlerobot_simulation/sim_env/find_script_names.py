# find_script_names.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

print("Attempting to find all scripts in the scene...")

try:
    # Get all script objects in the scene
    script_handles = sim.getObjectsInTree(sim.handle_scene, sim.object_script_type, 0)

    if not script_handles:
        print("\nFAILURE: No scripts found in the scene.")
    else:
        print(f"SUCCESS: Found {len(script_handles)} scripts.")
        
        for sh in script_handles:
            name = sim.getObjectAlias(sh, -1)
            print(f"  - Script Handle: {sh}, Name: {name}")

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')
