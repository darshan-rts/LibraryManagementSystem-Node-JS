const dbcon = require('./db');
class Library
{
    async getAllBooks()
    {
        const sql = 'SELECT * FROM book WHERE stocks > 0';
        const  books = await this.selectQuery(sql);
        return books;
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

    updateStocks(bookname, stocks)
    {
        const query = `UPDATE book SET stocks = ${stocks} WHERE bookname = '${bookname}'`;
        this.insertQuery(query, 'book');

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


}

module.exports = new Library();