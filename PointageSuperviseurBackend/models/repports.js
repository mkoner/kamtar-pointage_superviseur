const dbConn = require('../config/db.config')

const repports = {}

exports.getDaysInRangeQuery = async (reqData) => {
    const result = await dbConn.promise().query('SELECT SUM(DATEDIFF(CASE WHEN date_fin > ? THEN ? ELSE date_fin END, CASE WHEN date_debut < ? THEN ? ELSE date_debut END) ) FROM missions WHERE date_debut <= ? AND date_fin >= ? GROUP BY sup_id',
        [reqData.endDate, reqData.endDate, reqData.startDate, reqData.startDate, reqData.endDate, reqData.startDate])
    return result
}

exports.getMissionDaysQuery = async (reqData) => {
    const result = await dbConn.promise().query('SELECT SUM(DATEDIFF(date_fin, date_debut)) FROM missions WHERE date_debut <= ? AND date_fin >= ? GROUP BY sup_id',
    [reqData.endDate, reqData.startDate])
    return result
}

exports.getNbValideQuery = async (reqData) => {
    const result = await dbConn.promise().query('SELECT COUNT(id) AS nbValide FROM missions WHERE date_debut <= ? AND date_fin >= ? AND statut=? GROUP BY sup_id',
        [reqData.endDate, reqData.startDate, 'terminé validé'])
}

exports.getNbTermineQuery = async (reqData) => {
    const result = await dbConn.promise().query('SELECT COUNT(id) AS nbTermine FROM missions WHERE date_debut <= ? AND date_fin >= ? AND statut IN ? GROUP BY sup_id',
        [reqData.endDate, reqData.startDate, ['terminé','terminé validé'] ])
}

exports.getNbTotalQuery = async (reqData) => {
    const result = await dbConn.promise().query(`SELECT 
    nom_superviseur as nom,
    COUNT(id) AS nbTotal, 
    SUM(CASE WHEN statut IN ('terminé','terminé validé') THEN 1 ELSE 0 END) as nbTermine,
    SUM(CASE WHEN statut IN ('terminé validé') THEN 1 ELSE 0 END) as nbValide,
    SUM(DATEDIFF(CASE WHEN date_fin > ? THEN ? ELSE date_fin END, CASE WHEN date_debut < ? THEN ? ELSE date_debut END) ) as daysInRange,
    SUM(DATEDIFF(date_fin, date_debut))  AS missionDays
    FROM missions 
    WHERE date_debut between ? AND ?
    GROUP BY sup_id`,
        [reqData.endDate, reqData.endDate, reqData.startDate, reqData.startDate, reqData.startDate, reqData.endDate])
    return result[0]
}

exports.getRepportsBySup = async (reqData) => {
    const result = await dbConn.promise().query(`SELECT 
    id as id,
    nom_client as client,
    statut as statut,
    DATE_FORMAT(date_debut, "%d-%m-%Y %H:%i:%j") as debut, 
    DATE_FORMAT(date_debut_validation_date, "%d-%m-%Y %H:%i:%j")as debutValide,
    DATE_FORMAT(date_fin, "%d-%m-%Y %H:%i:%j") as fin,
    DATE_FORMAT(date_fin_validation_date, "%d-%m-%Y %H:%i:%j") as finValide,
    SUM(DATEDIFF(CASE WHEN date_fin > ? THEN ? ELSE date_fin END, CASE WHEN date_debut < ? THEN ? ELSE date_debut END) + 1 ) as dureeInclusPeriode,
    SUM(DATEDIFF(date_fin, date_debut) + 1)  AS dureeTotal
    FROM missions 
    WHERE date_debut between ? AND ? AND sup_id=?
    GROUP BY id`,
        [reqData.endDate, reqData.endDate, reqData.startDate, reqData.startDate, reqData.startDate, reqData.endDate, reqData.supId])
    return result[0]
}


