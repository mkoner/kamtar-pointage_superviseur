const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')

const CommentController = require('../controllers/comment.controller');


router.route('/').post(protect, CommentController.createComment)
    .get(protect, CommentController.getAllComments)
router.route('/mission/:id').get(protect, CommentController.getCommentsByMission)
router.route('/:id').get(protect, CommentController.getCommentByID).
    put(protect, CommentController.respond)
    .delete(protect, CommentController.deleteComment)

module.exports = router;