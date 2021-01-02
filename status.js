const express = require('express');
const router = express.Router();
const dbcon = require('./sql_db/db')
const requestData = require('./sql_db/requestData');

module.exports = () =>{
    router.get('/', async(req, res) =>{
        const requests = await requestData.getUserStatus(req.session.userid);
        res.render('status', {requests});        
    });
    return router;
}