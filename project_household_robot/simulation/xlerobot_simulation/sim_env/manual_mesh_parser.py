import xml.etree.ElementTree as ET
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
urdf_path = os.path.join(script_dir, 'simulation', 'xlerobot_coppeliasim', 'xlerobot.urdf')

print(f"Loading and parsing URDF file from: {urdf_path}")

try:
    tree = ET.parse(urdf_path)
    root = tree.getroot()

    # URDF files use package:// paths, we need to find the base path
    # The meshes are in XLeRobot_orign_repo/simulation/Maniskill/assets/xlerobot/meshes
    # The URDF is in sim_env/simulation/xlerobot_coppeliasim/
    # The original mesh paths are relative like 'package://xlerobot/meshes/base_link.stl'
    # I need to construct the full path to the original mesh directory.
    
    urdf_dir = os.path.dirname(urdf_path)
    print(f"Resolving mesh paths relative to: {urdf_dir}")

    mesh_files = []
    # Find all 'mesh' tags and get the 'filename' attribute
    for mesh_tag in root.findall('.//mesh'):
        filename = mesh_tag.get('filename')
        if filename:
            # Construct the full path relative to the URDF file's location
            full_path = os.path.abspath(os.path.join(urdf_dir, filename))
            mesh_files.append(full_path)

    if mesh_files:
        print("\n--- Found Required Mesh Files ---")
        # Using set to get unique paths
        unique_meshes = sorted(list(set(mesh_files)))
        for mesh in unique_meshes:
            # Check if the file actually exists
            if os.path.exists(mesh):
                print(f"[EXISTS] {mesh}")
            else:
                print(f"[MISSING] {mesh}")
    else:
        print("No mesh files were found referenced in the URDF.")

    print('\n--- Script finished ---')

except FileNotFoundError:
    print(f"Error: Could not find the URDF file at {urdf_path}")
except ET.ParseError:
    print(f"Error: Could not parse the XML in the URDF file at {urdf_path}")
