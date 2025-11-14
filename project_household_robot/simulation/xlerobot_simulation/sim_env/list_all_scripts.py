from zmqRemoteApi import RemoteAPIClient

client = RemoteAPIClient()
sim = client.getObject('sim')

# joint_handle vorher bestimmen (z.B. per Name):
# joint_handle = sim.getObject('/path/to/joint')
joint_handle = 79  # ersetzen

# Skriptobjekte im Baum des Gelenks
script_handles = sim.getObjectsInTree(joint_handle, sim.object_script_type, 0)

# Fallback: komplette Szene
if not script_handles:
    script_handles = sim.getObjectsInTree(sim.handle_scene, sim.object_script_type, 0)

for sh in script_handles:
    try:
        text = sim.getObjectStringParam(sh, sim.scriptstringparam_text)
    except Exception as e:
        text = f"<error reading script text: {e}>"
    enabled = sim.getObjectInt32Param(sh, sim.scriptintparam_enabled)
    typ = sim.getObjectInt32Param(sh, sim.scriptintparam_type)
    name = sim.getObjectAlias(sh, -1)
    print(f"script handle={sh}, name={name}, enabled={enabled}, type={typ}\n---code---\n{text}\n\n")
