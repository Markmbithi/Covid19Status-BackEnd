const crypto = require('crypto');

const secret = crypto.randomBytes(64).toString('hex');

module.exports = {
    'secret': secret,
     'config' : {
        user: 'sa',
        password: '&Isaiah2911',
        server: 'localhost', 
        database: 'covid' 
    }
}