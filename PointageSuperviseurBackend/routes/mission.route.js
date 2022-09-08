const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')

const MissionController = require('../controllers/mission.controller')

router.route('/').post(protect, MissionController.createMission).get(protect, MissionController.getAllMissions)
router.route('/validate/:id').put(protect, MissionController.validateMissionDate)
router.route('/fin/:id').put(protect, MissionController.finDeMission)
router.route('/all/:month/:year').get(protect, MissionController.getAllMissionsByMonth)
router.route('/superviseur/:id/:month/:year').get(protect, MissionController.getMissionBySupAndMonth)
router.route('/superviseur/:id').get(protect, MissionController.getMissionsBySup)
router.route('/:id').get(protect, MissionController.getMissionByID).put(protect, MissionController.updateMission)
    .delete(protect, MissionController.deleteMission)




module.exports = router;