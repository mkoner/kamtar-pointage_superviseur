const asyncHandler = require("express-async-handler");
const Comment = require("../models/comment.model");

// Create a comment
exports.createComment = asyncHandler(async (req, res) => {
    const commentTocreate = new Comment(req.body);
    commentTocreate.comment_date = new Date();
    commentTocreate.commented_by = req.user.id;
    commentTocreate.commented_by_display = req.user.prenom + ' ' + req.user.nom;

    Comment.createComment(commentTocreate, (err, comment) => {
        if (comment.insertId)
          res.status(200).json({
            success: true,
            message: "Comment Created Successfully",
            data: comment.insertId,
          });
        else
          res.status(500).json({
            success: false,
            message: "Error while creating Comment",
          });
      });
    } 
);

// get all comments list
exports.getAllComments = asyncHandler(async (req, res) => {
      const users = await Comment.getAllComments();
      res.status(200).json(users);
    })


// get all comments by mission
exports.getCommentsByMission = asyncHandler(async (req, res) => {
      const comments = await Comment.getCommentsByMission(req.params.id);
      res.status(200).json(comments);
    } 
);
  

// get Comment by ID
exports.getCommentByID = asyncHandler(async (req, res) => {
      const comment = await Comment.getCommentByID(req.params.id);
      if (!comment) {
        res.status(404);
        throw new Error("No comment with that id found");
      }
      res.status(200).json(comment);
});


// respond to a comment
exports.respond = asyncHandler(async (req, res) => {
  var response;
    response = req.body;
    response.responseDate = new Date();
    response.respondedBy = req.user.id;
  response.respondedByDisplay = req.user.prenom + ' ' + req.user.nom;
  
  const comment = await Comment.getCommentByID(req.params.id);

  if (comment.commented_by == req.user.id) {
    res.status(401).json({
      message : "Vous ne pouvez pas répondre à votre propre commentaire"
    });
  } else
  {
    Comment.respond(
        req.params.id,
        response,
        (err, comment) => {
          if (err) res.satus(500).json("Error responding to comment");
          res.status(200).json("Comment responded");
        }
      );}
});


// delete comment
exports.deleteComment = (req, res) => {
    if (req.user.role != "Admin")
      res.status(401).json({
        message: "You do not have enough permission",
      });
    else
      Comment.deleteComment(req.params.id, (err, comment) => {
        if (err)
          res.status(500).json({
            message: "Error deleting comment",
          });
        res
          .status(200)
          .json({ success: true, message: "Comment deleted successully!" });
      });
  };