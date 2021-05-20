const express = require('express');
const app = express();
const cors = require('cors');

var authController= require('./controllers/auth')

// API Routes
app.use('api', authController);

// start server
const server = app.listen(4000, function () {
    console.log('Authentication Server listening on port ' + 4000);
});