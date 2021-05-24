const crypto = require('crypto');

const accessTokenSecret = crypto.randomBytes(64).toString('hex');

module.exports = {
    'secret': accessTokenSecret,
    'sqlconfig': {
        user: 'sa',
        password: '&Isaiah2911',
        server: 'localhost', 
        database: 'covid',
        port: 1433,
        options: {
            trustedConnection: true,
            encrypt: true,
            trustServerCertificate: true,
        }
    }
}
 
// Every login we create a new secret and TOTP code with the secret. We store secret and phone number of the person loging in. When authenticating 
// code we find secret by phone number and authenticate code. If phone number exists