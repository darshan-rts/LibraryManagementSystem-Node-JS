const express = require('express');
const router = express.Router();
const requestData = require('./sql_db/requestData');

module.exports = (bookdetails) =>{
    router.get('/', async(req, res) =>{
        const books = await requestData.getIssuedRequest(req.session.userid);
        res.render('issuedbook', {books});
    });
    return router;
}