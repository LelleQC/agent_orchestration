@echo off
setlocal

:: Set the path to your CoppeliaSim installation directory
set COPPELIASIM_DIR="C:\Program Files\CoppeliaRobotics\CoppeliaSimEdu"

:: Set the path to the lua directory
set LUA_DIR=%COPPELIASIM_DIR%\lua

:: Set the path to the original sandboxScript.lua file
set SANDBOX_SCRIPT=%LUA_DIR%\sandboxScript.lua

:: Set the path to the modified sandboxScript_modified.lua file
set MODIFIED_SCRIPT="C:\Users\lenna\Documents\AI_projects\agent_orchestration\project_household_robot\simulation\xlerobot_simulation\sim_env\sandboxScript_modified.lua"

:: Backup the original file
echo Backing up the original sandboxScript.lua file...
if exist %SANDBOX_SCRIPT% (
    ren %SANDBOX_SCRIPT% sandboxScript.lua.bak
    echo Backup created: sandboxScript.lua.bak
) else (
    echo Original sandboxScript.lua not found. Skipping backup.
)

:: Copy the modified file
echo Copying the modified script...
copy %MODIFIED_SCRIPT% %SANDBOX_SCRIPT%
if %errorlevel% equ 0 (
    echo Modified script copied successfully.
) else (
    echo Error copying the modified script.
)

echo.
echo ---
echo.
echo The next step is to run the simulation in CoppeliaSim and copy the console output.
echo.
echo To revert the changes, run the following commands:
echo del %SANDBOX_SCRIPT%
echo ren %LUA_DIR%\sandboxScript.lua.bak sandboxScript.lua
echo.

endlocal
