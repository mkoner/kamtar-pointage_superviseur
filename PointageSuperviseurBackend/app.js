const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {errorHandler} = require('./middleware/errorHandler')

const app = express()
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/v1/users', require('./routes/app-user.route'))
app.use('/api/v1/missions', require('./routes/mission.route'))
app.use(errorHandler)


// start the server
app.listen(port, () => {
    console.log(`PointageSuperviseur Server listening at Port: ${port} started at ${new Date()}`);
});