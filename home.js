const express = require('express');
const issuedBook = require('./issuedBook');
const router = express.Router();
const bookdetails = require('./sql_db/bookData');
const redirectLogin = require('./redirectLogin');
const request = require('./sql_db/requestData');
const pendingRequest = require('./pendingRequest');

module.exports = (bookdata)=>{
    let session
    router.get('/', (req, res, next)=>{
        const username = 'darshan';
        session = req.session.userid;
        res.render('home', {username, bookdata});
        next();
    });

    router.get("/addbook",(req, res, next) => {
        request.makeRequest(req.query.id, session);
       // bookdetails.insertUserDetails(req.query, session);
        res.redirect('/login/home');
        next();
    });
    router.use('/pendingrequests', pendingRequest());
    router.use("/issuedbook", redirectLogin, issuedBook(bookdetails));
   
    return router;
}