function sysCall_init()
    -- Get arguments from sim params
    local urdf_in = sim.getStringParameter(sim.stringparam_app_arg1)
    local ttt_out = sim.getStringParameter(sim.stringparam_app_arg2)

    if not urdf_in or not ttt_out then
        sim.addLog(sim.verbosity_scripterrors, "Error: Input URDF or output TTT file path not provided as arguments.")
        sim.quit()
        return
    end

    -- Import the URDF file
    local model_handle = simURDF.importFile(urdf_in, true, true, true, true)

    if model_handle and #model_handle > 0 then
      -- Save the scene
      sim.saveScene(ttt_out)
      sim.addLog(sim.verbosity_scriptinfos, "Successfully converted " .. urdf_in .. " to " .. ttt_out)
    else
      sim.addLog(sim.verbosity_scripterrors, "Failed to import URDF file: " .. urdf_in)
    end

    -- Quit CoppeliaSim
    sim.quit()
end

function sysCall_actuation()
end

function sysCall_sensing()
end

function sysCall_cleanup()
end
