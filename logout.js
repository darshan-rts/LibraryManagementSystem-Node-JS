const express = require('express');
const router = express.Router();

module.exports = ()=>{

    function redirectLogin(req, res, next)
    {
        if(req.session.userid)
        {
            next();
        }
        else
        {
            res.redirect('/login');
        }
    }
    router.get('/', redirectLogin, (req, res)=>{
        req.session.destroy(err=>{
            if(err)
            {
                throw err;
            }
            else{
                res.redirect('/login');
            }
        });
        
        res.redirect('/login');
    });
    return router;
}