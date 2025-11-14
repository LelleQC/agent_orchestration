import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

# --- Main Script ---
if __name__ == "__main__":
    print("--- Real-time Joint Position Monitor ---")
    client = RemoteAPIClient()
    
    try:
        sim = client.require('sim')
        ELBOW_HANDLE = 82 
        MAX_FORCE = 100.0
        TARGET_POS = 1.0

        if sim.getSimulationState() == sim.simulation_stopped:
            print("Error: Simulation must be running. Please press Play.")
        else:
            print("Successfully connected. Simulation is running.")
            
            # 1. Set max force
            print(f"Setting max force for Elbow joint to: {MAX_FORCE}")
            sim.setJointMaxForce(ELBOW_HANDLE, MAX_FORCE)
            time.sleep(0.1)

            # 2. Get initial position
            initial_pos = sim.getJointPosition(ELBOW_HANDLE)
            print(f"Initial Elbow Position: {initial_pos:.2f} radians\n")

            # 3. Send the move command
            print(f"--> Sending command to move to {TARGET_POS} radians...")
            sim.setJointTargetPosition(ELBOW_HANDLE, TARGET_POS)
            
            # 4. Monitor the position in real-time for 3 seconds
            print("Monitoring position for 3 seconds (10Hz):")
            for i in range(30):
                current_pos = sim.getJointPosition(ELBOW_HANDLE)
                if current_pos is not None:
                    # Create a simple visual bar to show the position
                    # 0.0 rads on the left, PI (3.14) in the middle, 2*PI on the right
                    progress = int((current_pos / (2*3.1415)) * 50) # 50 chars wide bar
                    bar = '#' * progress + '-' * (50 - progress)
                    print(f"Time {i/10.0:0.1f}s | Pos: {current_pos:.2f} rad | [{bar}]")
                time.sleep(0.1)

            print("\n--- Monitoring Finished ---")

    except Exception as e:
        print(f"\nAn error occurred: {e}")

    print("\n--- Script Finished ---")
