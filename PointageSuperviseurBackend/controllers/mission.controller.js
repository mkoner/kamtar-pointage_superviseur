const MissionModel = require('../models/mission.model')


// create new Mission
exports.createMission = async (req, res) =>{
    if(req.user.role != "Superviseur")
    res.status(401).json({
        success: false, 
        message: "Missions should be crated by a Superviseur"
    })
    const missionTocreate = new MissionModel(req.body);
    missionTocreate.date_creation = new Date()
    missionTocreate.date_debut = new Date()
    missionTocreate.sup_id = req.user.id
    console.log('missionTocreate', missionTocreate);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({success: false, message: 'Please fill all fields'});
    }else{
        MissionModel.createMission(missionTocreate, (err, mission)=>{
            if(mission.insertId)
            res.status(200).json({
                success: true, 
                message: 'Mission Created Successfully', 
                data: mission})
            else
            res.status(500).json({
                success: false,
                message: "Error while creating mission"
            })
        })
    } 
}

// get all missions
exports.getAllMissions = (req, res)=> {
    MissionModel.getAllMissions((err, missions) =>{
        if(err)
        res.status(500).json({
            message: "Error getting missions"
        })
        console.log('missions', missions);
        res.status(200).json({
            succes: true,
            message: "missions fetched",
            data: missions
        })
    })
}

// get missions by Sup and month
exports.getMissionsBySupAndMonth = (req, res)=> {
    MissionModel.getMissionBySup(req.body, (err, missions) =>{
        if(err)
        res.status(500).json({
            message: "Error getting missions"
        })
        console.log('missions', missions);
        res.status(200).json({
            succes: true,
            message: "Missions fetched",
            data: missions
        })
    })
}

// get Mission by ID
exports.getMissionByID = (req, res)=>{
    MissionModel.getMissionByID(req.params.id, (err, mission)=>{
        if(err)
        res.status(500).json({
            message: "Error getting mission"
        })
        console.log('single mission data',mission);
        res.status(200).json({
            succes: true,
            message: "mission fetched",
            data: mission
        });
    })
}

// Validate date
exports.validateMissionDate = (req, res)=>{
    console.log(req.user)
    if(req.user.role == "Superviseur")
       res.status(401).json({
        message: "You do not have enough permission"
       })
    else {
    req.body.validePar = req.user.id
    MissionModel.validateDate(req.params.id, req.body, (err, mission)=>{
        if(err)
        res.status(500).json({
            message: "Error validating mission date"
        })
        res.status(200).json({success: true, message: 'Date validated Successfully', data: mission})
    })
}
}

// Set date de fin 
exports.finDeMission = async(req, res)=>{
    console.log(req.user)
    mission = await MissionModel.getMissionByID1(req.params.id)
    console.log(mission)
    if(mission.sup_id != req.user.id)
    res.status(401).json({
        message: "You cannot set set date de fin to a mission you did not create"
    })
    else {
    req.body.date_fin = new Date()
    MissionModel.finDeMission(req.params.id, req.body, (err, mission)=>{
        if(err)
        res.status(500).json({
            message: "Error setting date de fin de mission"
        })
        res.status(200).json({success: true, message: 'Date de fin set Successfully', data: mission})
    })
}
}

// update Mission
exports.updateMission = (req, res)=>{
        MissionModel.updateMission(req.params.id, req.body, (err, mission)=>{
            if(err)
            res.status(500).json({
                message: "Error updating mission"
            })
            res.status(200).json({success: true, message: 'Mission updated Successfully', data: mission})
        })
}

// delete Mission
exports.deleteMission = (req, res)=>{
    if(req.user.role != "Admin")
    res.status(401).json({
        message: "You do not have enough permission"
    })
    else
    MissionModel.deleteMission(req.params.id, (err, mission)=>{
        if(err)
        res.status(500).json({
            message: "Error deleting user"
        })
        res.status(200).json({success:true, message: 'User deleted successully!'});
    })
}