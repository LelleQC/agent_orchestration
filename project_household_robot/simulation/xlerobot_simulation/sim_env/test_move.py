from coppeliasim_zmqremoteapi_client import RemoteAPIClient

client = RemoteAPIClient()
sim = client.getObject('sim')

# Use the correct constants for clarity and correctness
scene_handle = sim.handle_scene
all_object_type = sim.handle_all

print("Attempting to retrieve all objects from the scene...")
objs = sim.getObjectsInTree(scene_handle, all_object_type, 0)
print(f"Found {len(objs)} objects.")

if len(objs) > 0:
    # Try to move the *last* object in the list, as it's more likely to be a visible part
    h = objs[-1]
    
    # Get the object's name for better logging
    try:
        obj_name = sim.getObjectAlias(h)
        print(f"Attempting to move object: '{obj_name}' (handle: {h})")
    except Exception as e:
        print(f"Could not get name for object handle: {h}. Error: {e}")
        print(f"Attempting to move object with handle: {h}")

    pos = sim.getObjectPosition(h, -1)
    print(f"Position before: {pos}")
    
    new_pos = [pos[0] + 0.05, pos[1], pos[2]]
    sim.setObjectPosition(h, -1, new_pos)
    
    # It's good practice to call sim.step() to advance the simulation and see the change
    sim.step() 
    
    new_pos_after_move = sim.getObjectPosition(h, -1)
    print(f"Position after: {new_pos_after_move}")
    print("Movement command executed.")
else:
    print("No objects found in the scene. Please ensure meshes have been imported.")
