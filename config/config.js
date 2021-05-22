const crypto = require('crypto');

// Our secret for creating tokens will be crypto based
const accessTokenSecret = crypto.randomBytes(64).toString('hex');

module.exports = {
    'secret': accessTokenSecret,
     'config' : {
        user: 'sa',
        password: '&Isaiah2911',
        server: 'localhost', 
        database: 'covid' 
    }
}