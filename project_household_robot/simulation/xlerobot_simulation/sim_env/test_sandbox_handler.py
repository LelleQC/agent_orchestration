# test_sandbox_handler.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

print("Attempting to call handleSandboxScript...")

try:
    # Call handleSandboxScript and see what it returns
    result = sim.handleSandboxScript("sandboxScript")

    print(f"SUCCESS: handleSandboxScript returned: {result}")

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')
