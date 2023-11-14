const mysql = require('mysql2');

//Use pooling?
// https://stackoverflow.com/questions/18496540/node-js-mysql-connection-pooling?rq=3
// using createConnection instead of pooling as only one simultanous connection to the db is required.

// https://www.npmjs.com/package/mysql2/v/3.6.3#using-promise-wrapper

const connection = mysql.createConnection(
    {
      host: "localhost",
      // MySQL username,
      user: "root",
      // MySQL password
      password: "!System500",
      database: "hr_db",
    },
  );
  
class Queries {

    getAllDepartments() {
        connection.promise().query('SELECT * FROM departments')
            .then( ([rows,fields]) => {
                console.table(rows);
            })
            .catch(err => console.log(err))
    }

    getAllRoles() {
        connection.promise().query('SELECT * FROM roles')
            .then( ([rows,fields]) => {
                console.table(rows);
            })
            .catch(err => console.log(err))
    }

}
  
  


module.exports = Queries;
