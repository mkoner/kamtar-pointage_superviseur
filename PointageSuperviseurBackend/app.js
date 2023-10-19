const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {errorHandler} = require('./middleware/errorHandler')

const app = express()
const port = process.env.PORT || 4000;

corsOption = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    exposedHeaders: 'Token'
}
app.use(cors(corsOption))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/v1/users', require('./routes/app-user.route'))
app.use('/api/v1/missions', require('./routes/mission.route'))
app.use('/api/v1/repports', require('./routes/repports.route'))
app.use('/api/v1/comments', require('./routes/comment.route'))
app.use(errorHandler)


// start the server
app.listen(port, () => {
    console.log(`PointageSuperviseur Server listening at Port: ${port} started at ${new Date()}`);
});