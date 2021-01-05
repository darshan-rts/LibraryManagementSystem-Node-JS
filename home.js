const express = require("express");
const issuedBook = require("./issuedBook");
const router = express.Router();
const bookdetails = require("./sql_db/bookData");
const redirectLogin = require("./redirectLogin");
const requestData = require("./sql_db/requestData");
const status = require("./status");
const library = require('./sql_db/library');
const user = require('./sql_db/userData');

module.exports = () => {
  let session, count = 0;
  router.get("/", async(req, res) => {
    const bookdata = await library.getAllBooks();
    session = req.session.userid;
    const username = session
    res.render("home", { username, bookdata });
  });

  async function bookValidaton(req, res, next)
  {
   // let valid = false;
    const bookids = await requestData.getBookForUser(session, req.query.id);
    const count = await user.getBookCount(session);
    bookcount = count[0].book_count ? count[0].book_count : 0;
    // console.log("=====================================",bookcount)
    // console.log("================================================",bookids)
    if(bookids.length > 0 || bookcount > 2)
    {

      res.redirect('/login/home');  
    }
    else
    {
        next();
    }
   
  }


  router.get("/addbook", [redirectLogin, bookValidaton], (req, res) => {
   // library.updateStocks(req.query.id, stocks);
    bookcount++;
    user.storeBookCount(bookcount, session);
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
