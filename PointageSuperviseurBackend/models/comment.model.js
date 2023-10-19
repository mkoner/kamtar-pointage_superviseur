const dbConn = require('../config/db.config')

const Comment = function (comment) {
    this.mission_id = comment.mission_id
    this.message = comment.message
    this.response = comment.response
    this.commented_by = comment.commented_by
    this.responded_by = comment.commented_by
    this.commented_by_display = comment.commented_by_display
    this.responded_by_display = comment.responded_by_display
    this.comment_date = comment.comment_date
    this.response_date = comment.response_date
}

// get all comments
Comment.getAllComments = async () => {
    const result = await dbConn.promise().query('SELECT * FROM comments')
    return result[0]
}

// get all comments by mission
Comment.getCommentsByMission = async (mission) => {
    const result = await dbConn.promise().query('SELECT * FROM comments WHERE mission_id=?', [mission])
    return result[0]
}

// get comment by ID
Comment.getCommentByID = async (id) => {
    const result = await dbConn.promise().query('SELECT * FROM comments WHERE id=?', id)
    return result[0][0]
}

// create new comment
Comment.createComment = (reqData, result) => {   
    dbConn.query('INSERT INTO comments SET ? ', reqData, (err, res)=>{
        if(err){
            console.log('Error while inserting data');
            console.log(err)
            result(null, err);
        }else{
            console.log('comment created successfully');
            result(null, res)
        }
    })
}

// respond
Comment.respond = (id, reqData, result) => {
    reqData.response_date = new Date()   
    dbConn.query("UPDATE comments SET response=?, response_date=?, responded_by_display=?, responded_by=? WHERE id = ?",
     [reqData.response, reqData.responseDate, reqData.respondedByDisplay, reqData.respondedBy, id], (err, res)=>{
        if(err){
            console.log('Error while respondin to the comment');
            result(null, err);
        }else{
            console.log("comment updated successfully");
            result(null, res);
        }
    });
}

// delete comment
Comment.deleteComment = (id, result)=>{
    dbConn.query('DELETE FROM comments WHERE id=?', [id], (err, res)=>{
        if(err){
            console.log('Error while deleting the comment');
            result(null, err);
        }else{
            result(null, res);
        }
    });
}

module.exports = Comment