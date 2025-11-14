import sys
from coppeliasim_zmqremoteapi_client import RemoteAPIClient

def scan_scene_scripts():
    print("Connecting to CoppeliaSim...")
    client = RemoteAPIClient()
    sim = client.require('sim')

    print("--- Starting Deep Script Scan ---")
    
    # 1. Check the Main Script (Global behavior)
    try:
        print("Attempting to get the main script handle...")
        main_script_handle = sim.getScript(sim.scripttype_mainscript)
        print(f"Main script handle: {main_script_handle}")
        scan_script(sim, main_script_handle, "Main Script")
    except Exception as e:
        print(f"Could not access Main Script: {e}")

    # 2. Try to read defaultMainScript
    try:
        print("Attempting to read defaultMainScript...")
        script_content = sim.getScriptStringParam('defaultMainScript', sim.scriptstringparam_text)
        print("Successfully read defaultMainScript")
        print(f"Content of defaultMainScript:\n{script_content}")
    except Exception as e:
        print(f"Could not read defaultMainScript: {e}")


    print(f"--- Scan Complete. ---")

def scan_script(sim, script_handle, source_name):
    try:
        print(f"Scanning script: {source_name} (Handle: {script_handle})")
        # THIS IS THE FIX: Use getScriptStringParam instead of getScriptText
        script_content = sim.getScriptStringParam(script_handle, sim.scriptstringparam_text)
        
        print(f"Successfully read script content for {source_name}")
        
        # Keywords to look for
        keywords = ['sandbox', 'snap', 'reset', 'move', 'joint']
        
        # Check if any keyword is in the content (case insensitive)
        found_keywords = [kw for kw in keywords if kw in script_content.lower()]
        
        if found_keywords:
            print(f"\n[SUSPECT] {source_name} (Handle: {script_handle})")
            print(f"    Keywords found: {found_keywords}")
            print(f"    Snippet: {script_content[:100]}...") # Print first 100 chars
            
            # If this looks like the sandbox script, dump the whole thing
            if 'sandbox' in found_keywords or 'sandboxscript' in script_content.lower():
                print("    !!! POTENTIAL CULPRIT FOUND !!!")
                print(f"    Full Content of {source_name}:\n")
                print(script_content)
                print("-" * 40)
        else:
            print(f"No suspicious keywords found in {source_name}")
            print(f"Content of {source_name}:\n{script_content}")


    except Exception as e:
        print(f"Error reading script for {source_name}: {e}")

if __name__ == "__main__":
    scan_scene_scripts()
