const express = require('express');
const app = express();
const port = process.env.PORT || 4000

const Routes = require('./routes/auth-routes')

app.use('/test', (req, res) =>{
    res.status(200).send({message:'Covid Server running well'})
})

app.use('/', Routes);

app.listen(port, () => {
    console.log('Covid Results Server listening on port ' + port);
});