const dbcon = require('./db');
const books = require('../book.json');
const userData = require('./userData');

class Request
{
    async makeRequest(bookid, userid)
    {
        const user = await userData.getUserById(userid);
   
        const book = books.filter((book)=>{
            if(book.bookid == bookid)
            {
                return book;
            }
        });

        if(book.length > 0)
        {
            const {bookid, bookname, publishdate, author} = book[0];            
            const query = `INSERT INTO book_request(book_name, author, user_id, book_id, user_name, req_accepted) 
                             VALUES ('${bookname}', '${author}', ${userid},
                             '${bookid}', '${user[0].user_name}', 'No')`;
                             
            dbcon.query(query, (err, result)=>{
                if(err)
                {
                    console.log(err);
                }
                else{
                    console.log('1 record inserted');
                }
            })


        }
    }

    getUserPendingRequest(userid)
    {
       // console.log(userid);
        return new Promise ((resolve, reject)=>{
            const query = `SELECT * FROM book_request 
                            WHERE user_id = '${userid}' AND req_accepted = 'No'`;

            dbcon.query(query, (err, result)=>{
                if(err)
                {
                    reject(err)
                }
                else{
                    console.log(result)
                    resolve(result);
                }
            })
        })
    }

    getAllPendingRequest()
    {
        return new Promise((resolve, reject)=>{
            const query = `SELECT * FROM book_request
                             WHERE req_accepted = 'No'`;
            dbcon.query(query, (err, result)=>{

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

    getIssuedRequest(userid)
    {
        return new Promise((resolve, reject)=>{
            const query = `SELECT * FROM book_request
                             WHERE req_accepted = 'Yes' AND user_id = ${userid}`;
            dbcon.query(query, (err, result)=>{

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

    updateRequest(user)
    {
        const {bookid, userid} = user;
        const query = `UPDATE book_request
                        SET req_accepted = 'Yes' 
                        WHERE
                        book_id = '${bookid}' 
                        AND
                        user_id = '${userid}'`;
        dbcon.query(query, err=>{
            if(err)
            {
                console.log(err);
            }
            else{
                console.log('Table Updated');
            }
        })
    }

    deleteRequest(user)
    {
        const {bookid, userid} = user;
        const query = `DELETE FROM book_request
                       WHERE
                        book_id = '${bookid}' 
                        AND
                        user_id = '${userid}'`;
        dbcon.query(query, (err)=>{
            if(err)
            console.log(err);
            else{
                console.log('Record Deleted');
            }
        })
    }
    
}

module.exports = new Request();