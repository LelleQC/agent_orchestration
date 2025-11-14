# Roadmap: XLeRobot CoppeliaSim Integration

This document outlines the development process for integrating and controlling the XLeRobot in the CoppeliaSim environment.

---

## 1. Initial Setup & Environment Verification

-   [DONE] Set up Python virtual environment and install necessary dependencies (`coppeliasim-zmqremoteapi-client`).
-   [DONE] Create a test script (`test_connection.py`) to verify the ZMQ Remote API connection to CoppeliaSim.

## 2. Model Import and Scene Setup

-   [DONE] Attempt to run a movement script (`test_move.py`) and diagnose the failure (`object does not exist`).
-   [DONE] Conclude that the simulation scene is empty.
-   [DONE] Formulate hypothesis that the robot model must be imported.
-   [DONE] Attempt to find a command-line tool to convert the `.urdf` file to a `.ttt` scene file. (Failed)
-   [DONE] Attempt to import the robot model by manually importing all its mesh files (`.stl`, `.ply`).
-   [DONE] Diagnose that manual mesh import does not create controllable `Joint` objects, only static shapes.
-   [DONE] Realize that specific application knowledge is missing and research is needed on the CoppeliaSim application itself.
-   [DONE] Identify the correct import method after exploring the application's menus: the **URDF Importer Add-on**.
-   [DONE] Instruct the user to manually find and use the importer via the menu (`Module -> Importers -> URDF`).
-   [DONE] Create `list_objects.py` to verify that the model, including `Joint` objects, is now correctly loaded in the scene.

## 3. Basic Arm Control & "Snap-Back" Debugging

-   [DONE] Create a basic script (`control_joint.py`) to test single-joint movement.
-   [DONE] Observe the "snap-back" behavior: the joint moves briefly and then returns to its original position.
-   [DONE] Formulate hypothesis: An internal script is overriding the API commands.
-   [DONE] Investigate joint properties using `check_joint_mode.py` and confirm that `sim.jointintparam_ctrl_enabled` is active.
-   [DONE] Attempt to disable the controller with `disable_control_mode.py`, which fails, proving the existence of a competing script.
-   [DONE] Develop a "brute-force" workaround (`oscillate_control.py`) to overpower the competing script, confirming the hypothesis but causing a "wobble".
-   [DONE] Receive crucial log information from the user: `[sandboxScript:info]`, identifying the potential source.

## 4. Advanced Debugging & Solution Implementation

-   [DONE] Investigate the `sandboxScript` system and identify `defaultMainScript.lua` as a key component.
-   [DONE] Analyze `defaultMainScript.lua` and identify `sim.handleJointMotion()` as the root cause of the "snap-back".
-   [DONE] Create a modified version of `defaultMainScript.lua` with the problematic line commented out.
-   [DONE] Address write-protection in the CoppeliaSim directory by creating a dynamic loading mechanism:
    -   [DONE] Create `sandboxScript_modified.lua` to add logging and serve as the new entry point.
    -   [DONE] Create `modify_and_write_sandbox_script.py` to dynamically alter the main sandbox script to load our modified version.
    -   [DONE] Create `revert_sandbox_script.py` to restore the original behavior.
-   [DONE] Update the primary control script (`control_arm.py`) to explicitly disable the joint controller (`sim.jointintparam_ctrl_enabled`) and set sufficient force (`sim.setJointMaxForce`).
-   [DONE] Create a new script (`control_base.py`) to demonstrate control over the robot's mobile base.
-   [DONE] Verify that all control scripts now work smoothly without the "snap-back" or "wobble" issues.

## 5. Final Documentation

-   [IN PROGRESS] Create a comprehensive `roadmap.md` (this file).
-   [TODO] Update `project_report.md` to reflect the full debugging story.
-   [TODO] Update `meta_learnings.md` with principles derived from the script conflict.
-   [TODO] Update `DEVELOPER_GUIDE.md` to explain the final architecture, including the script modification workaround.
-   [TODO] Create `.agent_version` file.
