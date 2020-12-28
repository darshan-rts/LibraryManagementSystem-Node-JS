const express = require('express');
const router = express.Router();

module.exports = (userData)=>{

    router.get('/', (req, res) =>{
        res.render('form', {template:'adduser'});
    });

    router.post('/register', (req, res)=>{
        const {email, username} = req.body;
        userData.insert(email, username);

    });

    return router;
}