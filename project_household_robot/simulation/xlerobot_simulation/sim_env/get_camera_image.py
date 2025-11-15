import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient
import numpy as np
import cv2

print("Connecting to CoppeliaSim...")
client = RemoteAPIClient()
sim = client.getObject('sim')

# Get the handle of the vision sensor
try:
    vision_sensor_handle = sim.getObjectHandle('DefaultCamera')
    print(f"Successfully got handle for 'DefaultCamera': {vision_sensor_handle}")
except Exception as e:
    print(f"Error getting vision sensor handle: {e}")
    exit()

# Get image from vision sensor
try:
    print("Requesting image from vision sensor...")
    img, resX, resY = sim.getVisionSensorCharImage(vision_sensor_handle)
    
    if img:
        print(f"Successfully received image with resolution {resX}x{resY}")
        # Convert the raw string image to a numpy array
        image_byte_array = bytearray(img)
        
        # Create a numpy array from the byte array
        # The image is RGB, so it has 3 channels
        numpy_image = np.array(image_byte_array, dtype=np.uint8)
        
        # Reshape the array to the image dimensions
        # The shape should be (height, width, 3) for an RGB image
        numpy_image = numpy_image.reshape((resY, resX, 3))
        
        # OpenCV expects images in BGR format, so we need to convert from RGB to BGR
        # The slicing [:, :, ::-1] reverses the order of the last dimension (channels)
        bgr_image = numpy_image[:, :, ::-1]
        
        # Save the image using OpenCV
        file_path = 'camera_image.png'
        cv2.imwrite(file_path, bgr_image)
        print(f"Image saved to {file_path}")
    else:
        print("Failed to get image from vision sensor.")

except Exception as e:
    print(f"An error occurred while getting the image: {e}")

print("Script finished.")
