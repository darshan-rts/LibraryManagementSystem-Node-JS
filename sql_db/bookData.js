const dbcon = require('./db');
class Book
{
    insertUserDetails(book, user_id)
    {
        const {id, name, author, pub_date} = book;
        console.log(user_id);
        const query = `INSERT INTO user_book_details(book_name, author, issue_date, user_id) 
                        VALUES ('${name}', '${author}', '${pub_date}', ${user_id})`;
        dbcon.query(query, (err, result) =>{
            if(err) 
            {
                throw err;
            }
           // console.log('Book issued against ', user_id);
        });

    }

    getUserBooks(userid)
    {
        return new Promise((resolve, reject)=>{
            const sql = `SELECT * FROM user_book_details 
                        WHERE user_id = ${userid}`;
            dbcon.query(sql, (err, result)=>{
                if(err)
                {
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }
}
module.exports = new Book();