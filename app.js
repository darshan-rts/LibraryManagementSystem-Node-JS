//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const addUser = require('./addUser');
const ejs = require("ejs");
const dbcon=require("./db");
const { getMaxListeners } = require("process");
const bookdata = require('./book.json');
const session = require('express-session');



// const userTable=' CREATE TABLE user(user_id INT AUTO_INCREMENT PRIMARY KEY ,user_name VARCHAR(255),user_email VARCHAR(255)) '
// const book = "CREATE TABLE book (book_id INT AUTO_INCREMENT PRIMARY KEY ,bookname VARCHAR(255), pub_date VARCHAR(255),author VARCHAR(255), user_id int, FOREIGN KEY (user_id) REFERENCES user(user_id))";
// dbcon.query(userTable);
// dbcon.query(book);

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ 
  
    // It holds the secret key for session 
    secret: 'Your_Secret_Key', 
  
    // Forces the session to be saved 
    // back to the session store 
    resave: true, 
  
    // Forces a session that is "uninitialized" 
    // to be saved to the store 
    saveUninitialized: true
}))

var sess;

app.get("/",function(req, res){
    res.send('Hey Project started!');
});

//app.use('/', addUser());

app.get("/adduser",function(req,res){
    res.render("form");

})

app.post("/adduser",function(req, res){

    console.log("Darshan ", req.body)

      const useremail=req.body.email
      const username=req.body.username
     
      const sql = `INSERT INTO user ( user_name, user_email ) VALUES ( '${username}', '${useremail}')`; 
    
      dbcon.query(sql, function (err, result) {  
      if (err) throw err;  
      console.log("1 record inserted");

      const currentuser = result.insertId;
     // console.log(currentuser);
     
      // console.log("id to be fetched ",sess.currentid);
      var getcurrentusername=`select user_name from user where user_id=${sess.currentid}`;

      dbcon.query(getcurrentusername, (err, result)=>{

          if(err) throw err;
           const name =  result[0].user_name;
           // console.log(name);
          res.render("login.ejs");
      })
          
      });
      
    
});

app.post('/login', (req, res) =>{
    const{email, name} = req.body;
    const user = `select * from user WHERE user_email = '${email}'`;
    dbcon.query(user, (err, confirmuser)=>{
        if(err) throw err;
        console.log(confirmuser);
        // sess=req.session;
        // sess.currentid = currentuser;
      
        res.render('home', {});
    })
    console.log(req.body);
})

app.get("/addbook",function(req,res){
    console.log(sess.currentid);
    console.log("--------------------------------------",req.query);
    const {id, name, author, date} = req.query;
     const sql = `INSERT INTO book ( bookname, pub_date, author, user_id) VALUES ( '${name}','${date}','${author}',${sess.currentid})`; 
      dbcon.query(sql, function (err, result) {  
      if (err) throw err;  
      console.log("1 record inserted");  
      });

      console.log("printing session from add  boook");
      console.log(sess.currentid);

    
  //   console.log(`Executed---------------------------------------`);
});

app.get('/issuedbook', (req, res)=>{
    const issuebook = `select bookname, author from book where user_id = ${sess.currentid}`;

    dbcon.query(issuebook, (err, books)=>{
        if(err)throw err;
        console.log('Issued Book ----------------------------------------------------')

        console.log(books);
        res.render('issuedbook', {books});
    })
    // try {
    //     const bookname = await dbcon.query(issuebook);
    //     console.log(bookname);
    //     res.render('issuedbook',{bookname});

    // } catch (error) {
    //     console.log(error);
    // }

});

let port =process.env.PORT;
if(port ==null || port ==""){
  port=3000;
}

app.listen(port, function() {
  console.log("Server has started on port 3000");
});