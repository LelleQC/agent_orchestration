import time
import cv2
from robot import Robot

def run_test():
    robot = None
    try:
        # 1. Initialize Robot
        print("--- Initializing Robot ---")
        robot = Robot()
        print("Robot initialized.")

        # 2. Test Camera
        print("\n--- Testing Camera ---")
        image = robot.get_image()
        if image is not None:
            file_path = 'robot_test_camera_output.png'
            cv2.imwrite(file_path, image)
            print(f"Camera test successful. Image saved to {file_path}")
        else:
            print("Camera test failed. No image received.")

        # 3. Test Arm
        print("\n--- Testing Arm ---")
        print("Moving elbow to 90 degrees...")
        robot.set_joint_position('arm_elbow', 90)
        time.sleep(3)
        print("Moving elbow back to 0 degrees...")
        robot.set_joint_position('arm_elbow', 0)
        time.sleep(3)
        print("Arm test complete.")

        # 4. Test Base
        print("\n--- Testing Base ---")
        print("Moving base forward (vx=0.1) for 2 seconds...")
        robot.set_base_velocity(vx=0.1)
        time.sleep(2)
        print("Stopping base...")
        robot.set_base_velocity(vx=0.0)
        time.sleep(1)
        
        print("Rotating base (v_rot=30) for 2 seconds...")
        robot.set_base_velocity(v_rot_deg_s=30)
        time.sleep(2)
        print("Stopping base...")
        robot.set_base_velocity(v_rot_deg_s=0)
        time.sleep(1)
        print("Base test complete.")

    except Exception as e:
        print(f"\nAn error occurred during the test: {e}")

    finally:
        # 5. Shutdown
        if robot:
            print("\n--- Shutting Down ---")
            robot.shutdown()

if __name__ == '__main__':
    run_test()
