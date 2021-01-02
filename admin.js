const express = require('express');
const requestData = require('./sql_db/requestData');
const library = require('./sql_db/library');
const adminReturn = require('./adminReturn.js');
const router = express.Router();

module.exports = ()=>{
   
    router.get('/', async(req, res)=>{
        const requests = await requestData.getStocksDetails("Pending");
        console.log(requests);
        res.render('admin', {requests});

    });

    let body;
    function handle (req, res, next)
    {
        const {handle} = req.body;
        let {stocks} = req.body;
        body = req.body;
        if(handle == "reject" || stocks <= 0)
        {
            next();
        }
        else
        {
            console.log(req.body)   
            stocks--;
            calculateExpiryDate(body.bookname, body.userid);
            requestData.updateRequest(req.body);
            library.updateStocks(req.body.bookname, stocks);
            res.redirect('/admin');
        }

    }

    function calculateExpiryDate(bookname, userid)
    {
        const currentTime = new Date();
        let time = 7 * 24 * 60 * 60 * 1000 + currentTime.getTime(); // Expiry date in Seconds
        const date = new Date(time); //Expriry date for Book
        requestData.addExpiryDate(date.toLocaleString(), bookname, userid);
        
    }



    router.post('/reject', handle, (req, res)=>{
       // console.log(req.query);
        console.log(req.body);
        requestData.deleteRequest(req.body);
        res.redirect('/admin');
    });

     router.get('/issuedbook', async(req, res)=>{
        const bookdata = await requestData.getStocksDetails("Accepted");
        console.log(bookdata);
        res.render('adminIssuedBook', {bookdata})
    });

    router.use('/return', adminReturn());

    

    
    return router;
}
