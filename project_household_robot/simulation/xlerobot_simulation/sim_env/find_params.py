import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

# --- Main Script ---
if __name__ == "__main__":
    print("--- Starting Brute-Force Parameter Finder ---")
    client = RemoteAPIClient()
    sim = client.require('sim')

    ELBOW_HANDLE = 82 
    # We will scan a range of potential parameter IDs
    # Common object parameters are in the low numbers, specific ones (like for joints) are often higher. 
    # Let's scan a wide range as requested.
    ID_RANGE_TO_SCAN = range(1, 4001) 

    found_params = {}

    try:
        if sim.getSimulationState() == sim.simulation_stopped:
            print("Error: Simulation must be running for this script to work. Please press Play.")
        else:
            print(f"Successfully connected. Scanning {len(ID_RANGE_TO_SCAN)} Parameter IDs for object handle {ELBOW_HANDLE}...")
            
            start_time = time.time()

            for param_id in ID_RANGE_TO_SCAN:
                # The function's return value is inconsistent. We check if it's a tuple before unpacking.
                response = sim.getObjectInt32Param(ELBOW_HANDLE, param_id)
                if isinstance(response, tuple):
                    result, value = response
                    # sim.res_ok is 0. If the call is successful, the parameter ID is valid.
                    if result == sim.res_ok:
                        found_params[param_id] = value
                        print(f"Found valid Parameter ID: {param_id}, Current Value: {value}")

            end_time = time.time()
            print(f"\nScan complete. Took {end_time - start_time:.2f} seconds.")

            if found_params:
                print("\n--- Summary of Found Parameters ---")
                # Sort by ID for readability
                for pid, val in sorted(found_params.items()):
                    print(f"ID: {pid:<5} | Value: {val}")
            else:
                print("\nNo valid integer parameters found in the scanned range.")


    except Exception as e:
        print(f"\nAn error occurred during the scan: {e}")

    print("\n--- Script Finished ---")
