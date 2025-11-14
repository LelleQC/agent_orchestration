import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

# --- Main Script ---
if __name__ == "__main__":
    print("--- Alternative Real-time Joint Monitor ---")
    client = RemoteAPIClient()
    
    try:
        sim = client.require('sim')
        ELBOW_HANDLE = 82 
        MAX_FORCE = 100.0
        TARGET_POS = 1.0
        # DataType 15 retrieves joint state data (position, force)
        DATA_TYPE_JOINT_STATE = 15

        if sim.getSimulationState() == sim.simulation_stopped:
            print("Error: Simulation must be running. Please press Play.")
        else:
            print("Successfully connected. Simulation is running.")
            
            # 1. Set max force
            print(f"Setting max force for Elbow joint to: {MAX_FORCE}")
            sim.setJointMaxForce(ELBOW_HANDLE, MAX_FORCE)
            time.sleep(0.1)

            # 2. Send the move command
            print(f"--> Sending command to move to {TARGET_POS} radians...")
            sim.setJointTargetPosition(ELBOW_HANDLE, TARGET_POS)
            
            # 3. Monitor the position in real-time using the alternative method
            print("Monitoring position for 3 seconds (10Hz) using getObjectGroupData:")
            for i in range(30):
                # This function gets data for ALL joints at once.
                # It returns: (returnCode, handles_array, intData, floatData, stringData)
                response = sim.getObjectGroupData(sim.handle_joint, DATA_TYPE_JOINT_STATE)
                
                elbow_pos = None
                if response and isinstance(response, tuple) and len(response) > 3:
                    handles = response[1]
                    float_data = response[3]
                    
                    # Find our elbow handle in the returned list of handles
                    try:
                        index = handles.index(ELBOW_HANDLE)
                        # The floatData array contains 2 values per joint (pos, force).
                        # So the position for our joint is at index * 2.
                        elbow_pos = float_data[index * 2]
                    except ValueError:
                        # Elbow handle was not in the returned list
                        elbow_pos = None

                if elbow_pos is not None:
                    print(f"Time {i/10.0:0.1f}s | Alternative Pos: {elbow_pos:.2f} rad")
                else:
                    print(f"Time {i/10.0:0.1f}s | Elbow handle {ELBOW_HANDLE} not found in group data.")

                time.sleep(0.1)

            print("\n--- Monitoring Finished ---")

    except Exception as e:
        print(f"\nAn error occurred: {e}")

    print("\n--- Script Finished ---")
