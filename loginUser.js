const express = require("express");
const app = express();
const router = express.Router();
const home = require("./home");
const redirectLogin = require('./redirectLogin');
const bookdetails = require('./sql_db/bookData');

module.exports = (userData) => {

  router.get("/", (req, res) => {
    res.render("login");
  });

  router.post("/", async (req, res, next) => {
    const { email, username } = req.body;
    const user = await userData.getUser(email);

    if (user.length > 0) {
      req.session.userid = user[0].user_id;
      session = user[0].user_id;
      res.redirect(`/login/home`);
    } 
    else {
      console.log("User not available");
      res.redirect("/login");
    }


  });

  router.use("/home", redirectLogin, home());

  

  return router;
};
