import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient
import numpy as np
import cv2

print("Connecting to CoppeliaSim...")
client = RemoteAPIClient()
sim = client.getObject('sim')

# --- Step 1: Create a Vision Sensor ---
try:
    print("Creating a new vision sensor...")
    
    # Define vision sensor parameters based on the API documentation
    options = 2  # Perspective operation mode
    int_params = [640, 480, 0, 0] # resolutionX, resolutionY, reserved, reserved
    # [near_clip, far_clip, view_angle, sensor_size_x, reserved, reserved, null_pixel_red, ...]
    float_params = [0.1, 10.0, 60.0 * (3.14159 / 180.0), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]

    # Create a vision sensor with the correct parameters
    vision_sensor_handle = sim.createVisionSensor(options, int_params, float_params)
    
    sim.setObjectAlias(vision_sensor_handle, "MyVisionSensor")
    print(f"Successfully created vision sensor with handle: {vision_sensor_handle}")

    # --- Step 2: Attach it to the robot's head camera frame ---
    try:
        # Get the handle of the camera frame on the robot's head
        camera_frame_handle = sim.getObjectHandle('head_camera_rgb_optical_frame_visual')
        print(f"Successfully got handle for 'head_camera_rgb_optical_frame_visual': {camera_frame_handle}")

        # Set the vision sensor's parent to be the camera frame
        sim.setObjectParent(vision_sensor_handle, camera_frame_handle, True)
        print("Successfully parented vision sensor to the camera frame.")

    except Exception as e:
        print(f"Error attaching vision sensor to camera frame: {e}")
        # Clean up the created sensor if attachment fails
        sim.removeObject(vision_sensor_handle)
        exit()

    # --- Step 3: Get image from the new vision sensor ---
    try:
        print("Requesting image from the new vision sensor...")
        # It might take a simulation step for the sensor to be ready
        time.sleep(0.1) 
        
        img, resX, resY = sim.getVisionSensorCharImage(vision_sensor_handle)
        
        if img:
            print(f"Successfully received image with resolution {resX}x{resY}")
            image_byte_array = bytearray(img)
            numpy_image = np.array(image_byte_array, dtype=np.uint8)
            numpy_image = numpy_image.reshape((resY, resX, 3))
            
            # The image from getVisionSensorCharImage is often flipped vertically
            # and in RGB format. We need to flip it and convert to BGR for OpenCV.
            numpy_image = cv2.flip(numpy_image, 0)
            bgr_image = cv2.cvtColor(numpy_image, cv2.COLOR_RGB2BGR)
            
            file_path = 'camera_image_from_vs.png'
            cv2.imwrite(file_path, bgr_image)
            print(f"Image saved to {file_path}")
        else:
            print("Failed to get image from the new vision sensor.")

    except Exception as e:
        print(f"An error occurred while getting the image: {e}")

    finally:
        # --- Step 4: Clean up by removing the created sensor ---
        print("Removing the created vision sensor...")
        sim.removeObject(vision_sensor_handle)
        print("Clean-up complete.")


except Exception as e:
    print(f"An error occurred during the process: {e}")

print("Script finished.")
