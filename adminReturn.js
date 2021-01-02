const requestData = require("./sql_db/requestData");
const library = require("./sql_db/library");


const express = require('express');
const router = express.Router();

module.exports = ()=>{
    async function calculateFine(bookdetails)
    {
        console.log(bookdetails);
        const {id, userid} = bookdetails;
        const expiry_date = await requestData.getExpiryDate(id, userid);
        const exp_ms = Date.parse(expiry_date);
        const current_ms = Date.now();

        total = current_ms - exp_ms;

        if(total > 0)
        {
            const fine = total/(1000*60*60*24);
            console.log(fine);
        }
        else
        {
            console.log('Everything is cleared');
        }        
        console.log('Fine Calculated');
    }

    router.get('/', (req, res)=>{
        let {stocks} = req.query;
        stocks++;
        library.updateStocks(req.query.bookname, stocks);
        requestData.bookReturned(req.query.id);
        calculateFine(req.query);
        res.redirect('/admin/issuedbook');
        
    });

    
   
    return router;
}
