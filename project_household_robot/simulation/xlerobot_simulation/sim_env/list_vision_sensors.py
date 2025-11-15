from coppeliasim_zmqremoteapi_client import RemoteAPIClient

client = RemoteAPIClient()
sim = client.getObject('sim')

# Use the correct constants
scene_handle = sim.handle_scene
all_object_type = sim.handle_all

print("--- Finding all vision sensors in the scene ---")
objs = sim.getObjectsInTree(scene_handle, all_object_type, 0)
print(f"Found {len(objs)} objects in total.")
print("\n--- Vision Sensor List (Name and Handle) ---")

vision_sensors_found = False
if len(objs) > 0:
    for h in objs:
        try:
            obj_type = sim.getObjectType(h)
            if obj_type == sim.object_visionsensor_type:
                vision_sensors_found = True
                obj_name = sim.getObjectAlias(h)
                print(f"- Name: '{obj_name}', Handle: {h}, Type: Vision Sensor")

        except Exception as e:
            # This might fail for some object types, so we can ignore them
            pass

if not vision_sensors_found:
    print("No vision sensors found in the scene.")

print("\n--- Script finished ---")
