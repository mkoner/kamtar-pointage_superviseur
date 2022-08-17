const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')

const AppUserController = require('../controllers/app-user.controller')

router.route('/').get(protect, AppUserController.getUsersByRole).post(AppUserController.createNewUser)
router.route('/all-users').get(protect, AppUserController.getAllUsers)
router.route('/:id').get(protect, AppUserController.getUserByID).put(protect, AppUserController.updateUser)
      .delete(protect, AppUserController.deleteUser)
router.route('/login').post(AppUserController.login)
router.route('/update-password/:id').put(protect, AppUserController.updateUserPassword)


module.exports = router;