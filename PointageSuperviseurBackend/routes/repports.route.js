const express = require('express');
const router = express.Router();

const RepportsController = require('../controllers/repports')

router.route("/").post(RepportsController.getNbTotal)
router.route("/sup").post(RepportsController.getRepportsBySup)

module.exports = router;