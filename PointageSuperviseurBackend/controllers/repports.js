const repportsQueries = require('../models/repports')

exports.getNbTotal = async (req, res) => {
    const nb = await repportsQueries.getNbTotalQuery(req.body)
    res.status(200).json(nb)
}

exports.getRepportsBySup = async (req, res) => {
    console.log("getRepportsBySup", req.body)
    const nb = await repportsQueries.getRepportsBySup(req.body)
    res.status(200).json(nb)
}