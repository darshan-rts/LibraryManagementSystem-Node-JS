
module.exports = function(req, res, next)
{
    console.log(req.session);
    console.log(req.session.userid);
    if(!req.session.userid)
    {
        res.redirect('/login');
    }
    else 
    {
        next();
        return;
    }
}