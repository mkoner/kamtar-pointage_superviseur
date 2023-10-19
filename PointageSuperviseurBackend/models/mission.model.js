const dbConn = require('../config/db.config')

const Mission = function(mission){
    this.sup_id = mission.sup_id
    this.date_debut = mission.date_debut
    this.date_fin = mission.date_fin
    this.nom_client = mission.nom_client
    this.date_debut_validation_date = mission.date_debut_validation_date
    this.date_debut_valide_par = mission.date_debut_valide_par
    this.date_debut_valide_par_prenom = mission.date_debut_valide_par_prenom
    this.date_fin_validation_date = mission.date_fin_validation_date
    this.date_fin_valide_par = mission.date_fin_valide_par
    this.date_fin_valide_par_prenom = mission.date_fin_valide_par_prenom
    this.mois1 = mission.mois1
    this.duree1 = mission.duree1
    this.annee1 = mission.annee1
    this.mois2 = mission.mois2
    this.duree2 = mission.duree2
    this.annee2 = mission.annee2
    this.date_creation = mission.date_creation
    this.statut = mission.statut
    this.code_operation = mission.code_operation
    this.nom_superviseur = mission.nom_superviseur
}

// create mission
Mission.createMission = (reqData, result) =>{
    dbConn.query('INSERT INTO missions SET ?', reqData, (err, res)=>{
        if (err) {
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
    valideParPrenom = reqData.valideParPrenom
    if(reqData.type == "debut"){
        reqData.date_debut_validation_date = new Date
        reqData.date = new Date(reqData.date)
        reqData.statut = "debut validé"
        dbConn.query('UPDATE missions SET date_debut_validation_date=?, date_debut_valide_par=?, date_debut_valide_par_prenom=?, date_debut=?, statut=? WHERE id=?',
        [reqData.date_debut_validation_date, validePar, valideParPrenom, reqData.date, reqData.statut, id], (err, res)=>{
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
    reqData.date = new Date (reqData.date)
    //console.log(endOfMonth)
    reqData.date_fin_validation_date = new Date()
    reqData.statut = "terminé validé"
        if(mission.date_debut.getMonth() == reqData.date.getMonth()){
            duree1 = Math.ceil((reqData.date - mission.date_debut) / msToDay) + 1
            mois1 = reqData.date.getMonth()
            annee1 = reqData.date.getFullYear()
            dbConn.query("UPDATE missions SET date_fin_validation_date=?, date_fin_valide_par=?, date_fin_valide_par_prenom=?, date_fin=?, duree1=?, mois1=?, annee1=?, statut=? WHERE id=?",
            [reqData.date_fin_validation_date, validePar, valideParPrenom, reqData.date, duree1, mois1, annee1, reqData.statut, id], (err, res)=>{
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
                duree1 = Math.ceil((endOfMonth - mission.date_debut) / msToDay)
                mois1 = mission.date_debut.getMonth()
                annee1 = mission.date_debut.getFullYear()
                duree2 = Math.ceil((reqData.date - endOfMonth) / msToDay) + 1
                mois2 = reqData.date.getMonth()
                annee2 = reqData.date.getFullYear()
                dbConn.query("UPDATE missions SET date_fin_validation_date=?, date_fin_valide_par=?, date_fin_valide_par_prenom=?, date_fin=?, duree1=?, mois1=?, annee1=?, duree2=?, mois2=?, annee2=?, statut=? WHERE id=?",
                [reqData.date_fin_validation_date, validePar, valideParPrenom, reqData.date, duree1, mois1,
                     annee1, duree2, mois2, annee2, reqData.statut, id], (err, res)=>{
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
    reqData.statut = "terminé"
    dbConn.query("UPDATE missions SET date_fin=?, statut=? WHERE id=?",
    [reqData.date_fin, reqData.statut, id], (err, res)=>{
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
    dbConn.query('UPDATE missions SET nom_client=?, code_operation=? WHERE id=?',
        [reqData.nom_client, reqData.code_operation, id], (err, res) => {
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
    dbConn.query('SELECT * FROM missions ORDER BY date_creation DESC', (err, res)=>{
        if(err){
            console.log('Error while fetching Missions', err);
            result(null,err);
        }else{
            console.log('Missions fetched successfully');
            result(null,res);
        }
    })
}

//get all missions by month
Mission.getAllMissionsByMonth = (month, year, result) => {
    dbConn.query('SELECT * FROM missions WHERE  (mois1=? OR mois2=?) AND (annee1=? OR annee2=?)',
        [month,month,year,year], (err, res) => {
        if(err){
            console.log('Error while fetching Missions', err);
            result(null,err);
        }else{
            console.log('Missions fetched successfully');
            result(null,res);
        }
    })
}

//get all missions by sup
Mission.getMissionsBySup = (id, result) => {
    dbConn.query('SELECT * FROM missions WHERE sup_id=? ORDER BY date_creation DESC',
        [id], (err, res) => {
        if(err){
            console.log('Error while fetching Missions', err);
            result(null,err);
        }else{
            console.log('Missions fetched successfully');
            result(null,res);
        }
    })
}

//get ongoing missions by sup
Mission.getOngoingMissionsBySup = async(id) => {
    try {
        const result = await dbConn.promise().query(`SELECT * FROM missions WHERE statut IN 
        ('créé','debut validé') AND sup_id=? ORDER BY date_creation DESC`,
            id)
        return result[0]
    } catch (error) {
         console.log(" Error getting ongoing missions by sup")
    }
}

//get completed missions by sup
Mission.getCompletedMissionsBySup = async(id) => {
    try {
        const result = await dbConn.promise().query(`SELECT * FROM missions WHERE 
        statut IN ('terminé','terminé validé') AND sup_id=? ORDER BY date_creation DESC`,
            id)
        return result[0]
    } catch (error) {
        console.log("Error getting completed missions by Sup")
    }
}

//get completed and validated missions by sup
Mission.getCompletedAndValidatedMissionsBySup = async(id) => {
    try {
        const result = await dbConn.promise().query(`SELECT * FROM missions WHERE 
        statut IN ('terminé validé') AND sup_id=? ORDER BY date_creation DESC`,
            id)
        return result[0]
    } catch (error) {
        console.log("Error getting completed and validated missions by Sup")
    }
}

// get missions by supId and month
Mission.getMissionBySupAndMonth = (id, month, year, result) => {
    dbConn.query('SELECT * FROM missions WHERE sup_id=? AND (mois1=? OR mois2=?) AND (annee1=? OR annee2=?)',
        [id,month,month,year,year], (err, res) => {
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