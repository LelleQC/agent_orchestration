from urdfpy import URDF
import os

# The working directory will be sim_env, so the path needs to be relative from there
urdf_path = 'simulation/xlerobot_coppeliasim/xlerobot.urdf'

print(f"Loading URDF file from: {urdf_path}")
model = URDF.load(urdf_path)
print('URDF successfully loaded!')
print('---')
print('Links:', [l.name for l in model.links])
print('---')
print('Joints:', [j.name for j in model.joints])
print('---')

print('Identifying required mesh files for CoppeliaSim import...')
mesh_files = []
for link in model.links:
    for visual in link.visuals:
        if visual.geometry.mesh is not None:
            mesh_path = visual.geometry.mesh.filename
            mesh_files.append(mesh_path)

if mesh_files:
    print("Found the following mesh files referenced in the URDF:")
    for mesh in set(mesh_files): # Using set to get unique paths
        print(f"- {mesh}")
else:
    print("No mesh files were found referenced in the URDF.")

print('---')
print("Script finished.")
