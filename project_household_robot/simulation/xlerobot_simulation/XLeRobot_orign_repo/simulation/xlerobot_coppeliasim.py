import sim
import time
import os

def connect_to_coppeliasim():
    print('Program started')
    sim.simxFinish(-1) # close all opened connections
    clientID = sim.simxStart('127.0.0.1', 19997, True, True, 5000, 5) # Connect to CoppeliaSim
    if clientID != -1:
        print('Connected to remote API server')
    else:
        print('Failed to connect to remote API server')
    return clientID

def load_urdf_model(clientID, urdf_path):
    # Stop simulation if running
    sim.simxStopSimulation(clientID, sim.simx_opmode_blocking)
    while sim.simxGetConnectionId(clientID) != -1 and sim.simxGetIntegerParameter(clientID, sim.sim_intparam_simulation_state, sim.simx_opmode_blocking)[1] != sim.sim_simulation_stopped:
        time.sleep(0.1)

    # Load the URDF model
    # The URDF file itself contains relative paths to the meshes folder.
    # CoppeliaSim's URDF importer should handle this if the URDF file is provided with its full path.
    res, handle = sim.simxLoadModel(clientID, urdf_path, 0, sim.simx_opmode_blocking)
    if res == sim.simx_return_ok:
        print(f'URDF model loaded successfully with handle: {handle}')
        # Optionally, set the model to a specific position
        sim.simxSetObjectPosition(clientID, handle, -1, [0, 0, 0.5], sim.simx_opmode_blocking)
    else:
        print(f'Failed to load URDF model. Error code: {res}')
    return handle

def main():
    clientID = connect_to_coppeliasim()
    if clientID == -1:
        return

    # Construct the absolute path to the URDF file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    urdf_file_path = os.path.join(current_dir, 'Maniskill', 'assets', 'xlerobot', 'xlerobot.urdf')

    robot_handle = load_urdf_model(clientID, urdf_file_path)

    if robot_handle != -1:
        # Start simulation
        res = sim.simxStartSimulation(clientID, sim.simx_opmode_blocking)
        if res == sim.simx_return_ok:
            print('Simulation started')
        else:
            print(f'Failed to start simulation. Error code: {res}')

        # Keep the connection alive for a few seconds or until user stops
        print("Simulation running. Press Ctrl+C to stop.")
        try:
            while sim.simxGetConnectionId(clientID) != -1:
                time.sleep(1)
        except KeyboardInterrupt:
            print("Stopping simulation...")
            sim.simxStopSimulation(clientID, sim.simx_opmode_blocking)
            print("Simulation stopped.")
    
    # Close the connection
    sim.simxFinish(clientID)
    print('Program ended')

if __name__ == '__main__':
    main()
