I am currently at a dead end and require assistance.

Here is a summary of my investigation so far:

**Objective:** Find and disable the script that is causing the "snap-back" behavior of the robot arm.

**Initial Information:**
- A log snippet suggested a script named `sandboxScript` was the culprit.
- The `handover_context.md` file confirmed this and suggested running `get_script_content.py` to read the script.

**Attempts to find the script:**
1.  **`get_script_content.py` with `sandboxScript`:** Failed, the script does not exist.
2.  **`find_script_names.py`:** Found no scripts in the scene.
3.  **`list_plugins.py`:** Found a list of plugins, but no obvious culprit.
4.  **`find_customization_script.py`:** Found no customization script associated with the joint.
5.  **`find_main_and_sandbox_scripts.py`:** This script, which searches for main, sandbox, child, customization, and add-on scripts, found 102 main scripts and 17 child scripts. However, I was unable to read the content of any of these scripts due to an error ("type object 'sim' has no attribute 'getScriptText'").
6.  **`get_script_from_object.py`:** Attempted to get the script content from an object handle directly, but this also failed.
7.  **`disable_script_on_object.py`:** Attempted to disable the script on an object directly, but this failed with the error "could not set parameter".

**Conclusion:**
I have been unable to find or disable the script that is causing the issue. The fact that I can't even read the content of the scripts I *can* find suggests that there is a fundamental issue with how I am interacting with the CoppeliaSim API, or that the scripts are protected in some way.

**Recommendation:**
I suspect the script is not a regular script object, but something more deeply embedded in the scene or simulation environment. It might be necessary to manually inspect the scene in the CoppeliaSim GUI to find the script. Look for scripts associated with the robot arm, the joints, or in the scene settings. The `temp help prompt.txt` file also mentions "Main-Script / Add-on / Plugin" as possible culprits.

I am ready for your guidance on how to proceed.
