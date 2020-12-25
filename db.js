const mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin123',
  database : 'library'
});
module.exports=connection;