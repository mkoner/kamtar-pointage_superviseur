const express = require('express')
const dotenv = require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/v1/users', require('./routes/app-user.route'))
app.use('/api/v1/missions', require('./routes/mission.route'))


// start the server
app.listen(port, () => {
    console.log(`PointageSuperviseur Server listening at Port: ${port} started at ${new Date()}`);
});