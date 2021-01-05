const requestData = require("./sql_db/requestData");
const library = require("./sql_db/library");
const express = require('express');
const router = express.Router();
const user = require('./sql_db/userData');

module.exports = ()=>
{
    async function calculateFine(bookdetails)
    {
        const {id, userid} = bookdetails;
        const expiry_date = await requestData.getExpiryDate(id, userid);
        const exp_ms = Date.parse(expiry_date[0].valid_till);
        const returned_ms = Date.now();

        let total_ms = returned_ms + (10*1000*60*60*24) - exp_ms;

        if(total_ms > 0)
        {
            const per_day_fine = 10;
            const fine = (total_ms/(1000*60*60*24)) * per_day_fine;
            return fine;
        }
        else
        {
            return false;
        }        
    }

    router.get('/', async(req, res)=>
    {
        let {stocks} = req.query;
        stocks++;
        library.updateStocks(req.query.bookname, stocks);
        requestData.bookReturned(req.query.id);
        const penalty = await calculateFine(req.query);
        req.session.penalty = penalty;
        library.updateStocks(req.body.bookname, stocks);
        const count = await user.getBookCount(req.query.userid);
        const bookcount = count[0].book_count - 1;
        user.storeBookCount(bookcount, req.query.userid);
        res.redirect('/admin/issuedbook');
        
    });


    
   
    return router;
}
