const express = require('express');
const app = express();
const port = process.env.PORT || 4000

const Routes = require('./routes/auth-routes')

app.use('/', Routes);

app.listen(port, () => {
    console.log('Covid Results Server listening on port ' + port);
});