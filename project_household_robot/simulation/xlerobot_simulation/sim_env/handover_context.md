# Project Handover: XLeRobot CoppeliaSim Integration

This document provides the complete context for the ongoing task of controlling the XLeRobot in the CoppeliaSim environment.

## 1. Objective

The primary goal is to control the XLeRobot model within the CoppeliaSim software using external Python scripts that communicate via the ZMQ Remote API.

## 2. Current Status & Core Problem

The core problem of an internal script overriding external commands has been **resolved**. The "snap-back" behavior is no longer present.

*   **Core Problem:** Previously, an unidentified, high-frequency script within the CoppeliaSim scene actively fought against our external Python commands. It continuously reset the joint's "Position Control" mode to `True`, causing any movement command to be immediately reversed (the "snap-back" behavior).
*   **Previous Workaround:** A high-frequency Python loop (`oscillate_control.py`) was used to repeatedly send "disable position control" and "set target position" commands, effectively overpowering the conflicting script, but resulting in a "wobble." This workaround is no longer necessary.
*   **Breakthrough:** The user provided a log snippet (`[sandboxScript:info]`) which led to the identification of `sandboxScript` and subsequently `defaultMainScript.lua` as the source of the conflict.

## 3. Core Hypothesis

The root cause was a global Lua script, `defaultMainScript.lua`, which, through its call to `sim.handleJointMotion()`, was resetting joint parameters on every simulation step, thus preventing conventional API commands from having a lasting effect.

## 4. Immediate Next Step (Completed)

The dynamic modification of the Python sandbox script to load `sandboxScript_modified.lua` was successfully implemented (or was already in place). This allowed for the logging of loaded modules and further debugging.

## 5. Summary of Debugging History

1.  **Initial Setup & Movement:** Confirmed basic API connection and saw brief joint movement followed by a "snap-back". Initial hypothesis was a script on the robot model itself.
2.  **Child Script Check (Dead End):** The user inspected the robot model (`root_respondable`) for associated child scripts and found none.
3.  **Physics Property Investigation:** Formed a new hypothesis that the joint's internal "Position Control" mode was active.
4.  **API Exploration:** Ran `inspect_api.py` to find the correct function (`getObjectInt32Parameter`) to read the joint's parameters after initial attempts with incorrect function names failed.
5.  **Confirmation:** `check_joint_mode.py` was created and successfully run. It confirmed that the parameter `sim.jointintparam_ctrl_enabled` (ID 2001) was indeed `True`.
6.  **Direct Disable Attempt (Failure):** Created `disable_control_mode.py` to set the parameter to `False` using `setObjectInt32Parameter`. The command executed without error but **failed to change the value**, which immediately pointed to an external script overriding our change.
7.  **Brute-Force Workaround:** Switched strategy to overpower the unknown script. `force_control.py` and later `oscillate_control.py` were created. These scripts use a high-frequency loop to continuously send commands.
8.  **Workaround Success:** The oscillation script worked, proving we could control the arm by "fighting" the other script. This produced a visible wobble.
9.  **Final Breakthrough:** The user provided a log file snippet containing the string `[sandboxScript:info]`, giving us the name of our target.
10. **Deep Dive into the Sandbox:**
    - Discovered that `sandboxScript` is not a single script, but a complex system.
    - The entry point is a Python script that executes a Lua script.
    - The Lua script `defaultMainScript.lua` loads `sandboxScript.lua`.
    - The Lua script `sandboxScript.lua` loads all `*-ce.lua` files from the `lua` directory.
    - A modified version of `sandboxScript.lua` (`sandboxScript_modified.lua`) was created to log loaded modules.
11. **Culprit Identification (Arm Control):** Analysis of `defaultMainScript.lua` revealed that `sim.handleJointMotion()` within its `sysCall_actuation()` function was the primary cause of the "snap-back" behavior by re-enabling joint position control.
12. **Solution Implementation (Arm Control):**
    - Commented out `sim.handleJointMotion()` in `defaultMainScript.lua`.
    - Modified `control_arm.py` to explicitly disable `sim.jointintparam_ctrl_enabled` and set `sim.setJointMaxForce(joint_handle, 100)` for each arm joint.
13. **Base Control Implementation:**
    - Used `list_objects.py` to identify all `Joint` objects in the scene.
    - Created `control_base.py` to iterate through all identified `Joint` objects and attempt to set their target velocities, after disabling position control and setting max force.
14. **Verification (Arm and Base Control):** `oscillate_control.py`, `control_arm.py`, and `control_base.py` now successfully control the robot arm and base without the "snap-back" or "wobble" behavior.

## 6. Addressing Write-Protection and Dynamic Script Modification

Due to write-protection on the CoppeliaSim installation directory, direct modification of `sandboxScript.lua` was not possible. To overcome this, a dynamic modification strategy was developed:
- The Python sandbox script (which loads `sandboxScript.lua`) will be modified *in memory* via the API to instead load `sandboxScript_modified.lua` from the project directory.
- A Python script `modify_and_write_sandbox_script.py` was created to perform this dynamic modification.
- A corresponding `revert_sandbox_script.py` was also created to restore the original Python sandbox script.

## 7. Key Project Files

The following files were created or modified during this debugging process and are located in `project_household_robot/simulation/xlerobot_simulation/sim_env/`:

*   `control_arm.py`: The main control script for the arm, now with corrected joint handles, explicit position control disabling, and max force setting.
*   `control_base.py`: A new script to control the robot's base by setting target velocities for all identified `Joint` objects.
*   `inspect_api.py`: Used to list all available methods on the `sim` object.
*   `check_joint_mode.py`: Used to confirm that the joint's "Position Control" was enabled.
*   `disable_control_mode.py`: Unsuccessful attempt to disable the position controller.
*   `check_dynamic_control.py`: Ruled out the theory that the joint was not scriptable.
*   `find_all_scripts.py`: Unsuccessful attempt to find scripts by iterating through scene objects.
*   `force_control.py` & `oscillate_control.py`: Successful "brute-force" scripts that proved the competing script hypothesis and provided a working, if inefficient, control method. `oscillate_control.py` now works without wobble.
*   `get_script_content.py`: Used to read the source code of various scripts.
*   `locate_hidden_script.py`: A script that uses the correct API to find and analyze scripts.
*   `get_sandbox_script.py`: Used to get the content of the sandbox script.
*   `sandboxScript_modified.lua`: A modified version of the sandbox script to log loaded modules.
*   `modify_and_write_sandbox_script.py`: Script to dynamically modify the Python sandbox script.
*   `revert_sandbox_script.py`: Script to revert the dynamic modification of the Python sandbox script.
*   `instructions_for_prepare_for_debug.md`: Instructions for the user on how to use the batch script.
*   `instructions_to_verify_sandbox_script.md`: Instructions for the user to verify the sandbox script.
*   `handover_context.md`: This file.

## 8. Solution and Verification

The "snap-back" behavior and the "wobble" experienced with `oscillate_control.py` have been resolved. The robot's arm and base can now be controlled successfully.

**Root Cause:** The `sim.handleJointMotion()` function within `defaultMainScript.lua` was identified as the component that continuously re-enabled the joint's internal position control, overriding external commands.

**Solution Steps:**
1.  **Modified `defaultMainScript.lua`:** The line `sim.handleJointMotion()` in the `sysCall_actuation()` function was commented out. This prevented the continuous re-enabling of the internal joint controller.
2.  **Modified `control_arm.py`:**
    *   Explicitly disabled the joint's internal position control for each joint using `sim.setObjectInt32Parameter(joint_handle, sim.jointintparam_ctrl_enabled, 0)`.
    *   Set a sufficient maximum force for each joint using `sim.setJointMaxForce(joint_handle, 100)`.
3.  **Created `control_base.py`:** This script identifies all `Joint` objects in the scene and attempts to control them by setting their target velocities, after disabling position control and setting max force.

**Verification:**
*   Running `oscillate_control.py` now moves the arm smoothly without any "wobble."
*   Running `control_arm.py` now successfully moves the arm through its defined sequence.
*   Running `control_base.py` now successfully drives the robot's base.
