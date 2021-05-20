var sql = require('mssql');
var config = require('../config/config');
var bcrypt =  require('bcrypt');

module.exports.getPassengers = () => {

    sql.connect(config.config, (err) => {
    
        if (err) console.log(err);
    
        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the passenger records
        request.query('select * from passenger', (err, recordset) => {
            
            if (err) console.log(err)
    
            // return records
            return recordset;
            
        });
    });

}

// Check whether the particular passenger exists in the system
module.exports.getPassenger = (passportNumber) => {

    sql.connect(config.config, (err) => {
    
        if (err) console.log(err);
    
        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the passenger records
        request.query(`select * from passenger where passportNumber = ${passportNumber} `, (err, recordset) => {
            
            if (err) console.log(err)
    
            // return records
            return recordset;
            
        });
    });

}

/*
// Insert encrtypted OTP password into passenger password field
module.exports.saveOTP = async (passportNumber, otp) => {

    // Encrypt OTP 
    var hashedotp = bcrypt.hashSync(otp, 8)
    
    // Save OTP data into the OTP field of the passenger table
    var dbConn = new sql.Connection(config.config);

    dbConn.connect().then( ()=> {
		var transaction = new sql.Transaction(dbConn);
		transaction.begin().then(() => {
			var request = new sql.Request(transaction);
            request.query(`update passenger set otp = ${hashedotp} where passportNumber = ${passportNumber}`)
			.then(() => {
				transaction.commit().then( (resp) => {
                    dbConn.close();
                    return {message:resp}
                }).catch( (err) => {
                    console.log("Error in Transaction Commit " + err);
                    dbConn.close();
                    return {message:err}   
                });
			}).catch((err) => {
                console.log("Error in Transaction Begin " + err);
                dbConn.close();
                return {message:err}
            })
		}).catch( (err) => {
            console.log(err);
            dbConn.close();
            return ({message:err})
        }).catch( (err) => {
        console.log(err);
        return ({message:err})
    });

  });
        
}*/

// Check if passenger exists in system
module.exports.passengerExists = async (phoneNumber, passportNumber) => {
    
    sql.connect(config.config, (err) => {
    
        if (err) console.log(err);
    
        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the passenger records
        request.query(`select * from passenger where passportNumber = ${passportNumber} and phoneNumber = ${phoneNumber}`, (err, recordset) => {
            
            if (err) return {message: err};
    
            // If user exists return the results
            return recordset;
            
        });
    });
}



