import time
import cv2
import numpy as np
from robot import Robot

def run_autonomous_task():
    robot = None
    target_object_handle = -1
    try:
        # 1. Initialize Robot
        print("--- Initializing Robot for autonomous task ---")
        robot = Robot()

        # 2. Create a target object to find
        print("\n--- Creating target object (a red sphere) ---")
        shape_handle = robot.sim.createPrimitiveShape(robot.sim.primitiveshape_spheroid, [0.1, 0.1, 0.1])
        robot.sim.setObjectAlias(shape_handle, "RedTarget")
        # Position it in front of the robot
        robot.sim.setObjectPosition(shape_handle, -1, [1, 0, 0.2]) 
        # Set its color to red
        robot.sim.setShapeColor(shape_handle, None, robot.sim.colorcomponent_ambient_diffuse, [1.0, 0.0, 0.0])
        target_object_handle = shape_handle
        print(f"Target object created with handle: {target_object_handle}")
        time.sleep(1)

        # 3. Autonomous Loop: Find and Center the Object
        print("\n--- Starting autonomous 'find and center' loop ---")
        for i in range(15): # Run for a max of 15 iterations
            image = robot.get_image()
            if image is None:
                print("Cannot get image, stopping.")
                break

            # Convert image to HSV color space for better color detection
            hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

            # Define the range for red color
            lower_red = np.array([0, 120, 70])
            upper_red = np.array([10, 255, 255])
            mask1 = cv2.inRange(hsv_image, lower_red, upper_red)

            lower_red = np.array([170, 120, 70])
            upper_red = np.array([180, 255, 255])
            mask2 = cv2.inRange(hsv_image, lower_red, upper_red)
            
            red_mask = mask1 + mask2

            # Find contours in the mask
            contours, _ = cv2.findContours(red_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

            if contours:
                # Find the largest contour
                largest_contour = max(contours, key=cv2.contourArea)
                M = cv2.moments(largest_contour)
                if M["m00"] > 0:
                    # Calculate the center of the contour
                    cx = int(M["m10"] / M["m00"])
                    image_center_x = image.shape[1] / 2
                    
                    # --- Control Logic ---
                    # If the object is to the left, turn left. If to the right, turn right.
                    error = cx - image_center_x
                    turn_speed = -error * 0.001 # Proportional control
                    
                    print(f"Iteration {i+1}: Object found at x={cx}. Error={error:.2f}. Turning with speed={turn_speed:.2f}")
                    robot.set_base_velocity(v_rot_deg_s=turn_speed * 100) # Scale up for visible turn

                    # If the object is close to the center, stop turning and break the loop
                    if abs(error) < 20:
                        print("Object is centered. Stopping.")
                        robot.set_base_velocity()
                        break
                else:
                    # No object found, stop turning
                    robot.set_base_velocity()
            else:
                print(f"Iteration {i+1}: No red object found. Stopping.")
                robot.set_base_velocity()
                break
            
            time.sleep(0.5)
        
        print("\nAutonomous task finished.")

    except Exception as e:
        print(f"\nAn error occurred during the autonomous task: {e}")

    finally:
        # 5. Shutdown and Cleanup
        if robot:
            print("\n--- Shutting Down ---")
            if target_object_handle != -1:
                print(f"Removing target object {target_object_handle}...")
                robot.sim.removeObject(target_object_handle)
            robot.shutdown()

if __name__ == '__main__':
    run_autonomous_task()
