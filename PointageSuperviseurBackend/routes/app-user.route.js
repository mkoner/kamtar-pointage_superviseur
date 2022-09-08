const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')

const AppUserController = require('../controllers/app-user.controller')

router.route('/').get(protect, AppUserController.getAllUsers).post(protect, AppUserController.createNewUser)
router.route('/all-users').get(protect, AppUserController.getAllUsers)
router.route('/login').post(AppUserController.login)
router.route('/update-password/:id').put(protect, AppUserController.updateUserPassword)
router.route('/admins').get(protect, AppUserController.getAdmins)
router.route('/managers').get(protect, AppUserController.getManagers)
router.route('/superviseurs').get(protect, AppUserController.getSuperviseurs)
router.route('/byid1/:id').get(AppUserController.getUserByID1)
router.route('/user/:id').get(protect, AppUserController.getUserByID).put(protect, AppUserController.updateUser)
      .delete(protect, AppUserController.deleteUser)


module.exports = router;