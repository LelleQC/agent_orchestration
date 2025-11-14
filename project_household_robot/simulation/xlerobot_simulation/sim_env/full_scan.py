import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

def scan_parameters(sim, object_handle, id_range):
    """
    Scans a range of parameter IDs for Int32 and Float types for a given object.
    """
    found_ints = {}
    found_floats = {}

    print(f"Scanning {len(id_range)} IDs for Int32 and Float parameters...")
    
    for param_id in id_range:
        # --- Check for Integer Parameters ---
        try:
            response_int = sim.getObjectInt32Param(object_handle, param_id)
            if isinstance(response_int, tuple):
                result, value = response_int
                if result == sim.res_ok:
                    found_ints[param_id] = value
        except Exception:
            pass # Ignore errors for invalid calls

        # --- Check for Float Parameters ---
        try:
            response_float = sim.getObjectFloatParam(object_handle, param_id)
            if isinstance(response_float, tuple):
                result, value = response_float
                if result == sim.res_ok:
                    found_floats[param_id] = value
        except Exception:
            pass # Ignore errors for invalid calls

    return found_ints, found_floats


# --- Main Script ---
if __name__ == "__main__":
    print("--- Starting Full Parameter Scan (Int32 & Float) ---")
    client = RemoteAPIClient()
    
    try:
        sim = client.require('sim')
        ELBOW_HANDLE = 82 
        ID_RANGE_TO_SCAN = range(1, 4001)

        if sim.getSimulationState() == sim.simulation_stopped:
            print("Error: Simulation must be running. Please press Play.")
        else:
            print(f"Successfully connected. Starting scan for object handle {ELBOW_HANDLE}...")
            start_time = time.time()

            int_params, float_params = scan_parameters(sim, ELBOW_HANDLE, ID_RANGE_TO_SCAN)

            end_time = time.time()
            print(f"\nScan complete. Took {end_time - start_time:.2f} seconds.")

            if int_params:
                print("\n--- Found INTEGER Parameters ---")
                for pid, val in sorted(int_params.items()):
                    print(f"ID: {pid:<5} | Value: {val}")
            else:
                print("\nNo valid INTEGER parameters found in the scanned range.")

            if float_params:
                print("\n--- Found FLOAT Parameters ---")
                for pid, val in sorted(float_params.items()):
                    print(f"ID: {pid:<5} | Value: {val:.4f}")
            else:
                print("\nNo valid FLOAT parameters found in the scanned range.")

    except Exception as e:
        print(f"\nAn error occurred: {e}")

    print("\n--- Script Finished ---")
