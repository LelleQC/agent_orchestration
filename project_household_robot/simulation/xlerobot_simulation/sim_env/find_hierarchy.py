import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

def get_object_name(sim, target_handle):
    """Helper function to get an object's name from its handle."""
    # This is inefficient, but the simplest way for a one-off script.
    # It iterates through all objects to find the one with the matching handle.
    all_objects = sim.getObjects(sim.handle_all, sim.object_shape_type | sim.object_joint_type | sim.object_dummy_type | sim.object_camera_type | sim.object_light_type)
    for obj_handle in all_objects:
        if obj_handle == target_handle:
            return sim.getObjectAlias(obj_handle)
    return f"[Handle: {target_handle}]"


def find_hierarchy(sim, target_handle):
    """Finds and prints the hierarchy for a given object handle."""
    hierarchy = []
    current_handle = target_handle
    
    print(f"Starting hierarchy search for handle: {target_handle}")

    # Loop until we reach the top (parent handle is -1)
    while current_handle != -1:
        # Get the name of the current object
        # The regular API has sim.getObjectAlias, let's use that.
        # The ZMQ remote API client might expose it directly.
        try:
            # Let's try to get the alias directly
            name = sim.getObjectAlias(current_handle)
            if not name: # If alias is empty, it might return an empty string
                name = f"[Unnamed Object, Handle: {current_handle}]"
        except Exception:
            # Fallback if getObjectAlias is not available or fails
            name = f"[Handle: {current_handle}]"

        hierarchy.insert(0, name)
        
        # Get the parent of the current object
        current_handle = sim.getObjectParent(current_handle)
        
    return hierarchy

# --- Main Script ---
if __name__ == "__main__":
    print("--- Finding Object Hierarchy ---")
    client = RemoteAPIClient()
    sim = client.getObject('sim')

    # The handle for the "Elbow" joint we want to find
    ELBOW_HANDLE = 82 

    try:
        if sim.getSimulationState() == sim.simulation_stopped:
            print("Error: Simulation is not running. Please press Play first for accurate results.")
        else:
            print("Successfully connected. Simulation is running.")
            
            path = find_hierarchy(sim, ELBOW_HANDLE)
            
            if path:
                print("\n--- Object Hierarchy Path ---")
                print(" -> ".join(path))
                print("\nBitte klappen Sie die Objekte in dieser Reihenfolge in der 'Scene Hierarchy' auf.")
            else:
                print("Could not determine hierarchy. Is the object handle correct?")

    except Exception as e:
        print(f"\nAn error occurred: {e}")

    print("\n--- Script Finished ---")
