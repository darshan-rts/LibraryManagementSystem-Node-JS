const mysql = require('mysql');
var connection = mysql.createConnection({
  connectionLimit: 10,
  host     : 'localhost',
  user     : 'root',
  password : 'admin123',
  database : 'library'
});

// connection.query = util.promisify(connection.query);
module.exports=connection;