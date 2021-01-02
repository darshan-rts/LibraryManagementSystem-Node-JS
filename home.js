const express = require("express");
const issuedBook = require("./issuedBook");
const router = express.Router();
const bookdetails = require("./sql_db/bookData");
const redirectLogin = require("./redirectLogin");
const requestData = require("./sql_db/requestData");
const status = require("./status");
const library = require('./sql_db/library');

module.exports = () => {
  let session;
  router.get("/", async(req, res) => {
    const username = "darshan";
    const bookdata = await library.getAllBooks();
    session = req.session.userid;
    res.render("home", { username, bookdata });
  });

  async function bookValidaton(req, res, next)
  {
   // let valid = false;
    const bookids = await requestData.getBookForUser(session, req.query.id);
    console.log(bookids)
    if(bookids.length > 0)
    {
      res.redirect('/login/home');
    }
    else{
      next();
    }

   
  }


  router.get("/addbook", [redirectLogin, bookValidaton], (req, res) => {
   // library.updateStocks(req.query.id, stocks);
    requestData.makeRequest(req.query.id, session);
    res.redirect("/login/home");
  });

 
  router.use("/status", status());
  router.use("/issuedbook", issuedBook(bookdetails));

  router.get("/comments", async (req, res) => {
    const comments = await requestData.getComments(session);
    // console.log(comments);
    res.render("comments", { comments });
  });

  return router;
};
