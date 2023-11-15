const mysql = require('mysql2');

// Use pooling?
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

    // mysql2 
        // docs on prepared statements:
            // https://www.npmjs.com/package/mysql2?activeTab=readme#using-prepared-statements
        // on promise-wrapper to upgrade non promise connection to promise:
            // https://www.npmjs.com/package/mysql2/v/3.6.3#using-promise-wrapper
    // MySQL doc for queries:
        // https://dev.mysql.com/doc/refman/8.0/en/select.html

    getAllDepartments() {
        // Query to show department id and department names
        connection.promise().query('SELECT * FROM departments')
            .then( ([rows,fields]) => {
                console.table(rows);
            })
            .catch(err => console.log(err))
    }

    getAllRoles() {
        // Query to show role id, job title, the department that role belongs to, and the salary for that role
        // Using left join as failsafe to include roles in case they haven't been assigned a department
        connection.promise().query(`
            SELECT roles.id, roles.title, departments.name AS department, roles.salary
            FROM roles
            LEFT JOIN departments ON roles.department_id = departments.id
        `)
            .then( ([rows,fields]) => {
                console.table(rows);
            })
            .catch(err => console.log(err))
    }

    getAllRoles() {
        // Using left join as failsafe to include roles in case they haven't been assigned a department
        // Requires joining both 'departments' and 'roles' table
        // For managers, requires left-joining the employee table w an alias (to include employees w manager = null)
        connection.promise().query(`
            SELECT
                employees.id,
                employees.first_name,
                employees.last_name,
                roles.title AS job_title,
                departments.name AS department,
                roles.salary,
                CONCAT(managers.first_name, ' ', managers.last_name) AS manager
            FROM employees
            JOIN roles ON employees.role_id = roles.id
            JOIN departments ON roles.department_id = departments.id
            LEFT JOIN employees AS managers ON employees.manager_id = managers.id
        `)
            .then( ([rows,fields]) => {
                console.table(rows);
            })
            .catch(err => console.log(err))
    }

    async addDepartment(newDepartmentName) {
        try {
            const [rows, fields] = await connection.promise().execute(
                'INSERT INTO departments (name) VALUES (?)',
                [newDepartmentName]
            );

            console.log(`Department '${newDepartmentName}' added successfully!`);
        } catch (error) {
            console.error('Error adding department:', error);
        }
    }

}
  
  


module.exports = Queries;
