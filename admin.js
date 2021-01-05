const express = require('express');
const requestData = require('./sql_db/requestData');
const library = require('./sql_db/library');
const adminReturn = require('./adminReturn.js');
const router = express.Router();
const user = require('./sql_db/userData');

module.exports = ()=>{
   
    router.get('/', async(req, res)=>{
        const requests = await requestData.getStocksDetails("Pending", "");
        console.log(requests);
        res.render('admin', {requests});

    });

    let body;
    async function handle (req, res, next)
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


    let bookcount;

   


    router.post('/reject', handle, async(req, res)=>{
       // console.log(req.query);
        console.log(req.body);
        const count = await user.getBookCount(req.body.userid);
        const bookcount = count[0].book_count - 1;
        user.storeBookCount(bookcount, req.body.userid);
        requestData.deleteRequest(req.body);
        res.redirect('/admin');
    });

     router.get('/issuedbook', async(req, res)=>{
        const bookdata = await requestData.getStocksDetails("Accepted", 'Returned');
        const penalty = req.session.penalty;
        req.session.penalty = false;
        console.log("==============================================>",penalty);
        res.render('adminIssuedBook', {bookdata, penalty})
    });

    router.use('/return', adminReturn());

    

    
    return router;
}
