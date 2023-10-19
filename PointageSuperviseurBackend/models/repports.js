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
        [reqData.endDate, reqData.startDate, ['terminé', 'terminé validé']])

}

exports.getNbTotalQuery = async (reqData) => {
    const result = await dbConn.promise().query(`SELECT 
    nom_superviseur as nom,
    COUNT(id) AS nbTotal, 
    SUM(CASE WHEN statut IN ('terminé','terminé validé') THEN 1 ELSE 0 END) as nbTermine,
    SUM(CASE WHEN statut IN ('terminé validé') THEN 1 ELSE 0 END) as nbValide,
    SUM(DATEDIFF(CASE WHEN date_fin > ? THEN ? ELSE date_fin END, CASE WHEN date_debut < ? THEN ? ELSE date_debut END) +1) as daysInRange,
    SUM(DATEDIFF(date_fin, date_debut) + 1)  AS missionDays
    FROM missions 
    WHERE date_debut <= ? AND date_fin >= ?
    GROUP BY sup_id`,
        [reqData.endDate, reqData.endDate, reqData.startDate, reqData.startDate, reqData.endDate, reqData.startDate,])

    return result[0]
}

exports.getRepportsBySup = async (reqData) => {
    const result = await dbConn.promise().query(`SELECT 
    id as id,
    code_operation as operation,
    nom_client as client,
    statut as statut,
    DATE_FORMAT(date_debut, "%d-%m-%Y") as debut, 
    DATE_FORMAT(date_debut_validation_date, "%d-%m-%Y")as debutValide,
    DATE_FORMAT(date_fin, "%d-%m-%Y") as fin,
    DATE_FORMAT(date_fin_validation_date, "%d-%m-%Y") as finValide,
    SUM(DATEDIFF(CASE WHEN date_fin > ? THEN ? ELSE date_fin END, CASE WHEN date_debut < ? THEN ? ELSE date_debut END) + 1 ) as dureeInclusPeriode,
    SUM(DATEDIFF(date_fin, date_debut) + 1)  AS dureeTotal
    FROM missions 
    WHERE date_debut <= ? AND date_fin >= ? AND sup_id=?
    GROUP BY id`,
        [reqData.endDate, reqData.endDate, reqData.startDate, reqData.startDate, reqData.endDate, reqData.startDate, reqData.supId,])

    return result[0]
}

exports.getPDFData = async (reqData) => {
    const result = await dbConn.promise().query(`
    SELECT 
users.prenom,
users.nom,
users.type as statut,
users.numero,
users.residence,
SUM(DATEDIFF(CASE WHEN missions.date_fin > ? THEN ? ELSE missions.date_fin END, CASE WHEN date_debut < ? THEN ? ELSE missions.date_debut END) +1) as daysInRange
FROM users
INNER JOIN missions ON users.id = missions.sup_id
WHERE missions.date_debut <= ? AND missions.date_fin >= ? AND users.type IN ('interne','contractuel')
GROUP BY missions.sup_id
    `, [reqData.endDate, reqData.endDate, reqData.startDate, reqData.startDate, reqData.endDate, reqData.startDate,])
return result[0]
}
