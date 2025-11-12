from coppeliasim_zmqremoteapi_client import RemoteAPIClient

client = RemoteAPIClient()
sim = client.getObject('sim')

# Use the correct constants
scene_handle = sim.handle_scene
all_object_type = sim.handle_all

print("--- Finding all objects in the scene ---")
objs = sim.getObjectsInTree(scene_handle, all_object_type, 0)
print(f"Found {len(objs)} objects in total.")
print("\n--- Object List (Name and Handle) ---")

if len(objs) > 0:
    for h in objs:
        try:
            # Using getObjectAlias is often better as it gets the user-defined name
            obj_name = sim.getObjectAlias(h)
            # We can also get the object type
            obj_type = sim.getObjectType(h)
            type_name = "Unknown"
            if obj_type == sim.object_shape_type:
                type_name = "Shape"
            elif obj_type == sim.object_joint_type:
                type_name = "Joint"
            elif obj_type == sim.object_camera_type:
                type_name = "Camera"
            elif obj_type == sim.object_light_type:
                type_name = "Light"
            
            print(f"- Name: '{obj_name}', Handle: {h}, Type: {type_name}")

        except Exception as e:
            print(f"- Could not get details for handle: {h}. Error: {e}")
else:
    print("No objects found in the scene.")

print("\n--- Script finished ---")
