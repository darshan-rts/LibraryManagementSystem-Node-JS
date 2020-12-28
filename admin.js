const express = require('express');
const requestData = require('./sql_db/requestData');
const router = express.Router();

module.exports = ()=>{
   
    router.get('/', async(req, res)=>{
        const requests = await requestData.getAllPendingRequest();
        console.log(requests);
        res.render('admin', {requests});

    });

    router.get('/accept', (req, res)=>{
        requestData.updateRequest(req.query);
        res.redirect('/admin')
    });

    router.get('/reject', (req, res)=>{
        requestData.deleteRequest(req.query);
        res.redirect('/admin');
    });
    return router;
}
