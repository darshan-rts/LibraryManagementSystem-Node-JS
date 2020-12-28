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

}

module.exports = new User();