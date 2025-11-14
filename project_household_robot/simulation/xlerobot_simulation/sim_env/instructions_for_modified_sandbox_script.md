I have a plan to identify the exact script that is causing the "snap-back" behavior. I need your help to execute this plan.

**The Plan:**
I have created a modified version of the `sandboxScript.lua` file. This modified script will print the names of all the modules it is loading into the CoppeliaSim console. This will allow us to identify the script that is causing the issue.

**Instructions:**
1.  **Backup the original file:**
    -   Go to the directory `C:\Program Files\CoppeliaRobotics\CoppeliaSimEdu\lua`.
    -   Rename the file `sandboxScript.lua` to `sandboxScript.lua.bak`.

2.  **Copy the modified file:**
    -   Copy the file `project_household_robot/simulation/xlerobot_simulation/sim_env/sandboxScript_modified.lua` to the directory `C:\Program Files\CoppeliaRobotics\CoppeliaSimEdu\lua`.
    -   Rename the copied file to `sandboxScript.lua`.

3.  **Run the simulation:**
    -   Start CoppeliaSim and run the simulation.
    -   Open the CoppeliaSim console (the text window that shows log messages).
    -   Copy the entire content of the console and paste it here.

**How to revert the changes:**
-   Delete the modified `sandboxScript.lua` file.
-   Rename `sandboxScript.lua.bak` back to `sandboxScript.lua`.

**IMPORTANT:**
This procedure involves modifying a file in the CoppeliaSim installation directory. Please make sure to follow the instructions carefully.

I am ready to analyze the console output once you provide it.
