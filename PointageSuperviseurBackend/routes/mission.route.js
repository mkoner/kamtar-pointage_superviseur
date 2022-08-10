const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')

const MissionController = require('../controllers/mission.controller')

router.route('/').post(protect, MissionController.createMission).get(protect, MissionController.getMissionsBySupAndMonth)
router.route('/:id').get(protect, MissionController.getMissionByID).put(protect, MissionController.updateMission)
    .delete(protect, MissionController.deleteMission)
router.route('/validate/:id').put(protect, MissionController.validateMissionDate)
router.route('/fin/:id').put(protect, MissionController.finDeMission)

module.exports = router;