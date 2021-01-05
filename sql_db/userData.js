const dbcon = require('./db');
class User
{ 


    insert(useremail, username)
    {
        const sqlquery = `INSERT INTO user ( user_name, user_email ) VALUES ( '${username}', '${useremail}')`;
        dbcon.query(sqlquery, (error, result) =>{
            if(error) throw error;
            console.log("User Data Inserted");
        });
    }

    getUser(useremail)
    {

        return new Promise((resolve, reject)=>{
            const sqlquery = `SELECT user_id, user_name FROM user WHERE user_email='${useremail}'`;
            const user = dbcon.query(sqlquery, (err, result) =>{
            if(err)
            {
                reject(err);
            }
            else{
               resolve(result);
            }
         });
            // return user;
        })

        
    }

    getUserById(userid)
    {

        return new Promise((resolve, reject)=>{
            const sqlquery = `SELECT user_id, user_name FROM user WHERE user_id='${userid}'`;
            const user = dbcon.query(sqlquery, (err, result) =>{
            if(err)
            {
                reject(err);
            }
            else{
               resolve(result);
            }
         });
            // return user;
        })

        
    }

    storeBookCount(bookcount, userid)
    {
        const sql = `UPDATE USER 
                     SET book_count = ${bookcount}
                     WHERE user_id = ${userid}`;
        this.insertQuery(sql, 'user');
    }

    async getBookCount(userid)
    {
        const sql = `SELECT book_count FROM USER WHERE user_id = ${userid}`;
        return await this.selectQuery(sql);
        
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

module.exports = new User();