I have created a batch script that will automate the process of preparing the environment for debugging.

**Instructions:**
1.  **Run the batch script:**
    -   Open a command prompt.
    -   Navigate to the directory `project_household_robot/simulation/xlerobot_simulation/sim_env`.
    -   Run the script `prepare_for_debug.bat`.

2.  **Run the simulation:**
    -   Start CoppeliaSim and run the simulation.
    -   Open the CoppeliaSim console (the text window that shows log messages).
    -   Copy the entire content of the console and paste it here.

**How to revert the changes:**
The batch script provides instructions on how to revert the changes. You can also run the following commands in a command prompt:
```
del "C:\Program Files\CoppeliaRobotics\CoppeliaSimEdu\lua\sandboxScript.lua"
ren "C:\Program Files\CoppeliaRobotics\CoppeliaSimEdu\lua\sandboxScript.lua.bak" sandboxScript.lua
```

I am ready to analyze the console output once you provide it.
