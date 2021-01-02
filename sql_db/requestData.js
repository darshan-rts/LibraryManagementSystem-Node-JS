const dbcon = require('./db');
const library = require('./library');
const userData = require('./userData');

class Request
{
    getDateAndTime()
    {
        const date = new Date();
        const dd = date.getDate();
        const mm = date.getMonth() + 1;
        const yyyy = date.getFullYear();
        const currentDate = dd+'/'+mm+'/'+yyyy;
        const currentTime = date.getHours()+":"+date.getMinutes();
        console.log(date.toLocaleString());
        return {date: currentDate, time:currentTime};
    }


    async makeRequest(bookid, userid)
    {
        // const {date, time} = this.getDateAndTime();
        const date = new Date();
        const date_current = date.toLocaleDateString();
        const time_current = date.toLocaleTimeString();

        const user = await userData.getUserById(userid);
        const books = await library.getAllBooks();

        const bookinfo = books.filter((book)=>{
            if(book.book_id == bookid)
            {
                return book;
            }
        });

        if(bookinfo.length > 0)
        {
            const {book_id, bookname, author} = bookinfo[0];      
            const query =  `INSERT INTO book_request(book_name, author, user_id, book_id, user_name, 
                            req_accepted, comments, date_current, time_current) 
                            VALUES ('${bookname}', '${author}', ${userid}, ${book_id}, '${user[0].user_name}', 
                            'Pending', ${null}, '${date_current}', '${time_current}')`;

            this.insertQuery(query, 'book_request');           
        }
    }

    async getExpiryDate(bookid, userid)
    {
        const query = `SELECT valid_till FROM book_request WHERE user_id = ${userid} AND book_id = ${bookid}`;
        return await this.selectQuery(query);
    }

    addExpiryDate(date_time, bookname, userid)
    {
        const query =  `UPDATE book_request 
                        SET valid_till = '${date_time}'
                        WHERE 
                        book_name = '${bookname}' AND user_id = ${userid}`;
        this.insertQuery(query, 'book_request');
    }

     insertQuery(sql, tablename)
    {
        dbcon.query(sql, (err)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                console.log(`Changes made to the ${tablename}`);
            }
        });
    }

    selectQuery(sql)
    {
        return new Promise((resolve, reject)=>{
            dbcon.query(sql, (err, result)=>{
                if(err)
                {
                    reject(err);
                }
                else
                {
                    resolve(result);
                }
            });
        });
        
    }

    async getBookForUser(userid, bookid)
    {
        const query =  `SELECT book_id FROM book_request
                        WHERE book_id = ${bookid} AND user_id = ${userid} 
                        AND (req_accepted = 'Returned' OR req_accepted = '')`;

        try {
            return await this.selectQuery(query);
        } catch (error) {
            console.log(error);
        }

         
    }

    bookReturned(bookid)
    {
        const query = ` UPDATE book_request 
                        SET req_accepted = "Returned"
                        WHERE book_id=${bookid}`
                        ;
        this.insertQuery(query, 'book_request');
    }
    

    async approvedBooks()
    {
        const query = 'SELECT * FROM book_request WHERE req_accepted = "Accepted"';
        return await this.selectQuery(query);
    }

    getUserStatus(userid)
    {
       // console.log(userid);
        return new Promise ((resolve, reject)=>{
            const query = `SELECT * FROM book_request 
                            WHERE user_id = '${userid}'`;

            dbcon.query(query, (err, result)=>{
                if(err)
                {
                    reject(err)
                }
                else{
                    resolve(result);
                }
            })
        })
    }

    getAllPendingRequest()
    {
        return new Promise((resolve, reject)=>{
            const query = `SELECT * FROM book_request
                             WHERE req_accepted = 'Pending'`;
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
                             WHERE req_accepted = 'Accepted' AND user_id = ${userid}`;
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
        const {bookname, userid} = user;
        const query = `UPDATE book_request
                        SET req_accepted = 'Accepted' 
                        WHERE
                        book_name = '${bookname}' 
                        AND
                        user_id = '${userid}'`;
        dbcon.query(query, err=>{
            if(err)
            {
                console.log(err);
            }
            else{
                console.log('Request Accepted');
            }
        })
    }

    deleteRequest(user)
    {
        const {bookname, userid} = user;

        const query = `UPDATE book_request
                        SET req_accepted = 'Rejected'
                       WHERE
                        book_name = '${bookname}' 
                        AND
                        user_id = '${userid}'`;
        dbcon.query(query, (err)=>{
            if(err)
            console.log(err);
            else{
                this.addComments(user);
                console.log('Request Rejected');
            }
        });
    }



    addComments(comments)
    {

        const {userid, bookname} = comments;
        let {comment} = comments;
        if(comment == '')
        {
            comment = "No Comments";
        }
        const query = `INSERT INTO comments(user_id, book_name, comments) VALUES
                        ('${userid}', '${bookname}', '${comment}' )`;
        dbcon.query(query, (err)=>{
            if(err)
            {
                console.log(err);
            }
            console.log("Comment Inserted")
        });
    }

    getComments(userid)
    {
        const query = `SELECT book_name, comments FROM comments WHERE user_id = ${userid}`;
        return new Promise((resolve, reject)=>{
            dbcon.query(query, (err, result)=>{
            if(err)
            {
                reject(err)
            }
            else{
                resolve(result)
                console.log(`$changes were made to comments table`)

            }
        });         
       
        });

    }

    execute(sql, table_name)
    {
         dbcon.query(query, (err)=>{
            if(err)
            {
                console.log(err);
            }
            console.log(`$changes were made to ${table_name} table`)
        });
    }

    async getStocksDetails(req)
    {
        const sql =    `SELECT bookname, book.book_id, book.bookname, user_name, book.author, stocks, 
                        req_accepted, book_request.user_id, date_current, time_current, valid_till
                        FROM book 
                        INNER JOIN book_request 
                        ON book_request.book_id = book.book_id 
                        AND book_request.req_accepted = '${req}'`;

       return await this.selectQuery(sql);

    }
    
}

module.exports = new Request();