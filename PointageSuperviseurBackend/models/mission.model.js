const dbConn = require('../config/db.config')
const dayjs = require('dayjs')

const Mission = function(mission){
    this.sup_id = mission.sup_id
    this.date_debut = mission.date_debut
    this.date_fin = mission.date_fin
    this.nom_client = mission.nom_client
    this.date_debut_validation_date = mission.date_debut_validation_date
    this.date_debut_valide_par = mission.date_debut_valide_par
    this.date_fin_validation_date = mission.date_fin_validation_date
    this.date_fin_valide_par = mission.date_fin_valide_par
    this.mois1 = mission.mois1
    this.duree1 = mission.duree1
    this.annee1 = mission.annee1
    this.mois2 = mission.mois2
    this.duree2 = mission.duree2
    this.annee2 = mission.annee2
    this.date_creation = mission.date_creation
}

// create mission
Mission.createMission = (reqData, result) =>{
    dbConn.query('INSERT INTO Missions SET ? ', reqData, (err, res)=>{
        if(err){
            console.log('Error while inserting data');
            result(null, err);
        }else{
            console.log('Mission created successfully');
            result(null, res)
        }
    })
}

// Validate date 
Mission.validateDate = async(id, reqData, result) => {
    validePar = reqData.validePar
    if(reqData.type == "debut"){
        reqData.date_debut_validation_date = new Date
        reqData.date_debut = new Date (reqData.date_debut)
        dbConn.query('UPDATE missions SET date_debut_validation_date=?, date_debut_valide_par=?, date_debut=? WHERE id=?',
        [reqData.date_debut_validation_date, validePar, reqData.date_debut, id], (err, res)=>{
            if(err){
                console.log("Error validating date debut")
                throw err
            }
            else{
                console.log("Date debut validated successfully")
                result(null, res)
            }
        })
    }
    if(reqData.type == "fin"){
    const mission = await Mission.getMissionByID1(id)
    const msToDay = 1000*60*60*24
    console.log(mission)
    console.log(reqData)
    reqData.date_fin = new Date (reqData.date_fin)
    //console.log(endOfMonth)
    reqData.date_fin_validation_date = new Date()
        if(mission.date_debut.getMonth() == reqData.date_fin.getMonth()){
            duree1 = Math.ceil((reqData.date_fin - mission.date_debut) / msToDay)
            mois1 = reqData.date_fin.getMonth()
            annee1 = reqData.date_fin.getFullYear()
            dbConn.query("UPDATE missions SET date_fin_validation_date=?, date_fin_valide_par=?, date_fin=?, duree1=?, mois1=?, annee1=? WHERE id=?",
            [reqData.date_fin_validation_date, validePar, reqData.date_fin, duree1, mois1, annee1, id], (err, res)=>{
                if(err){
                    console.log("Error validating date fin")
                    throw err
                }
                else{
                    console.log("Date fin validated successfully")
                    result(null, res)
                }
            })
        }
        else{
            endOfMonth = new Date (mission.date_debut.getFullYear(), mission.date_debut.getMonth()+1, 1)
            console.log(endOfMonth)
            console.log(reqData.date_fin)
                duree1 = Math.ceil((endOfMonth - mission.date_debut) / msToDay)
                mois1 = mission.date_debut.getMonth()
                annee1 = mission.date_debut.getFullYear()
                duree2 = Math.ceil((reqData.date_fin - endOfMonth) / msToDay)
                mois2 = reqData.date_fin.getMonth()
                annee2 = reqData.date_fin.getFullYear()
                dbConn.query("UPDATE missions SET date_fin_validation_date=?, date_fin_valide_par=?, date_fin=?, duree1=?, mois1=?, annee1=?, duree2=?, mois2=?, annee2=? WHERE id=?",
                [reqData.date_fin_validation_date, validePar, reqData.date_fin, duree1, mois1,
                     annee1, duree2, mois2, annee2, id], (err, res)=>{
                    if(err){
                        console.log("Error validating date fin")
                        throw err
                    }
                    else{
                        console.log("Date fin validated successfully")
                        result(null, res)
                    }
                })
        }

    }
}

// set date de fin de mission
Mission.finDeMission = (id, reqData, result) => {
    dbConn.query("UPDATE missions SET date_fin=? WHERE id=?",
    [reqData.date_fin, id], (err, res)=>{
        if(err){
            console.log("Error setting date fin")
            throw err
        }
        else{
            console.log("Date fin set successfully")
            result(null, res)
        }
    })
}

// update mission
Mission.updateMission = (id, reqData, result) =>{
    dbConn.query('UPDATE missions SET nom_client=? WHERE id=?',[reqData.nom_client, id], (err, res) =>{
        if(err){
            console.log("Error updating mission")
            throw err
        }
        else{
            console.log("Mission updated successfully")
            result(null, res)
        }
    })
}

//get all missions
Mission.getAllMissions = (result) =>{
    dbConn.query('SELECT * FROM missions', (err, res)=>{
        if(err){
            console.log('Error while fetching Missions', err);
            result(null,err);
        }else{
            console.log('Missions fetched successfully');
            result(null,res);
        }
    })
}

// get missions by supId and mois
Mission.getMissionBySup = (reqData, result) =>{
    if(reqData.sup_id && reqData.mois)
    dbConn.query('SELECT * FROM missions WHERE sup_id=? AND (mois1=? OR mois2=?)',
    [reqData.sup_id, reqData.mois, reqData.mois], (err, res)=>{
        if(err){
            console.log('Error while fetching Missions', err);
            result(null,err);
        }else{
            console.log('Missions fetched successfully');
            result(null,res);
        }
    })
    if(reqData.sup_id && !reqData.mois)
    dbConn.query('SELECT * FROM missions WHERE sup_id=?', 
    [reqData.sup_id], (err, res)=>{
        if(err){
            console.log('Error while fetching Missions', err);
            result(null,err);
        }else{
            console.log('Missions fetched successfully');
            result(null,res);
        }
    })
    if(!reqData.sup_id && reqData.mois)
    dbConn.query('SELECT * FROM missions WHERE mois1=? OR mois2=?',
    [reqData.mois], (err, res)=>{
        if(err){
            console.log('Error while fetching Missions', err);
            result(null,err);
        }else{
            console.log('Missions fetched successfully');
            result(null,res);
        }
    })
    if(!reqData.sup_id && !reqData.mois)
        dbConn.query('SELECT * FROM missions', (err, res)=>{
            if(err){
                console.log('Error while fetching Missions', err);
                result(null,err);
            }else{
                console.log('Missions fetched successfully');
                result(null,res);
            }
        })

    }

    // get mission by ID
Mission.getMissionByID = (id, result)=>{
    dbConn.query('SELECT * FROM missions WHERE id=?', id, (err, res)=>{
        if(err){
            console.log('Error while fetching mission by id', err);
            result(null,err);
        }else{
            return result(null, res);
        }
    })
}

// get mission by ID
Mission.getMissionByID1 = async(id)=>{
    const result = await dbConn.promise().query('SELECT * FROM missions WHERE id=?', id)
    return result[0][0]
}

Mission.deleteMission = (id, result)=>{
        dbConn.query('DELETE FROM missions WHERE id=?', [id], (err, res)=>{
            if(err){
                console.log('Error while deleting the mission');
                result(null, err);
            }else{
                result(null, res);
            }
        });
}

   module.exports = Mission