import time
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

# --- Main Script ---
if __name__ == "__main__":
    print("--- Inspecting Available API Attributes on the 'sim' Object ---")
    client = RemoteAPIClient()
    
    try:
        # We use client.require('sim') as it's the most robust way
        sim = client.require('sim')
        print("Successfully got 'sim' object. Now listing its attributes...")

        # Get all attributes of the sim object
        all_attributes = dir(sim)
        
        if all_attributes:
            print("\n--- Found the following attributes on the 'sim' object: ---")
            # Print them in a sorted, readable format
            for attr_name in sorted(all_attributes):
                print(f"- {attr_name}")
        else:
            print("Could not find any attributes on the 'sim' object.")

    except Exception as e:
        print(f"\nAn error occurred during inspection: {e}")

    print("\n--- Inspection Finished ---")
