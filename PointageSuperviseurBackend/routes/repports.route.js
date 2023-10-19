const express = require('express');
const router = express.Router();

const RepportsController = require('../controllers/repports')

router.route("/").post(RepportsController.getNbTotal)
router.route("/sup").post(RepportsController.getRepportsBySup)
router.route("/pdf").post(RepportsController.getPDFData)

module.exports = router;

