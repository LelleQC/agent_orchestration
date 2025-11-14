# revert_sandbox_script.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

print("Attempting to revert the sandbox script...")

try:
    script_handle = sim.getScript(sim.scripttype_sandboxscript)
    if script_handle != -1:
        sim.setScriptStringParam(script_handle, sim.scriptstringparam_text, '''#python

#luaExec require('sandboxScript')

#Python runs just so that we have _evalExec and similar

def sysCall_init():
    sim = require('sim')
''')
        print("SUCCESS: The sandbox script has been reverted to its original state.")
    else:
        print("FAILURE: Could not find the sandbox script.")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    print('Program finished')
