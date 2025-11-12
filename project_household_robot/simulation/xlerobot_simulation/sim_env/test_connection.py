from coppeliasim_zmqremoteapi_client import RemoteAPIClient

client = RemoteAPIClient()
sim = client.getObject('sim')
print("Connected to CoppeliaSim, sim time:", sim.getSimulationTime())