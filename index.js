const express = require('express');
const bodyParser =require('body-parser');
const Routes = require('./routes/auth-routes')
const app = express();

const port = process.env.PORT || 4000

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use('/test', (req, res) =>{
    res.status(200).send({message:'Covid Server running well'})
})

app.use('/', Routes);

app.listen(port, () => {
    console.log('Covid Results Server listening on port ' + port);
});