const express = require('express');
const router = express.Router();

module.exports = ()=>{

    // function redirectLogin(req, res, next)
    // {
    //     if(req.session.userid)
    //     {
    //         next();
    //     }
    //     else
    //     {
    //         res.redirect('/login');
    //     }
    // }
    router.get('/logout', redirectLogin, (req, res)=>{
        req.session = null;
        
        res.redirect('/login');
    });
    return router;
}