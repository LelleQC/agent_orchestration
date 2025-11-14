# list_plugins.py
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

print('Program started')

client = RemoteAPIClient()
sim = client.getObject('sim')

print("Attempting to list all loaded plugins...")

try:
    # Get all loaded plugins
    plugins = sim.getLoadedPlugins()

    if not plugins:
        print("\nFAILURE: No plugins found.")
    else:
        print(f"SUCCESS: Found plugins: {plugins}")
        

except Exception as e:
    print(f"\nAn error occurred: {e}")

finally:
    print('Program finished')