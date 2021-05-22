const sql = require('mssql');
const config = require('../config/config');

const getPassengers = () => {

    sql.connect(config.config, (err) => {
    
        if (err) console.log(err);
    
        const request = new sql.Request();
        
        request.query('select * from passenger', (err, recordset) => {
            
            if (err) console.log(err)
    
            return recordset;
            
        });
    });

}

const getPassengerDetails = (passportNumber) => {

    sql.connect(config.config, (err) => {
    
        if (err) console.log(err);
    
        const request = new sql.Request();
        
        request.query(`select * from passenger where passportNumber = ${passportNumber} `, (err, result) => {
            
            if (err) return { error: err}
    
            return { id: result.recordset[0].id, firstName: result.recordset[0].firstName, secondName: result.recordset[0].secondName, phoneNumber: result.recordset[0].phoneNumber };           
            
        });
    });

}

const passengerExists = async (passportNumber) => {

    try {
        let pool = await sql.connect(config.config)
        let result = await pool.request()
            .input('input_parameter', sql.NVarChar, passportNumber)
            .query('select * from passenger where passportNumber = @input_parameter')
        
        if(!result.recordsets.length) return { exists:false }

        return { exists:true }
    
    } catch (err) {
        return { error:err }
    }
}

module.exports = {
    passengerExists,
    getPassengers,
    getPassengerDetails
}