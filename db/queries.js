const mysql = require('mysql2');

// Use pooling?
// https://stackoverflow.com/questions/18496540/node-js-mysql-connection-pooling?rq=3
// using createConnection instead of pooling as only one simultanous connection to the db is required.

// https://www.npmjs.com/package/mysql2/v/3.6.3#using-promise-wrapper

const connection = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
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

    getAllEmployees() {
        // Using left join as failsafe to include roles in case they haven't been assigned a department
        // Requires joining both 'departments' and 'roles' table to employee
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

    // TODO: Refactor prior queries to also use async/await for consistency.
    async addDepartment(req) {
        // Take req passed from cli.handleAdditionalInput and insert into prepared statement to add department
        try {
            const [rows, fields] = await connection.promise().execute(
                'INSERT INTO departments (name) VALUES (?)',
                [req]
            );

            console.log(`Department '${req}' added successfully!`);
        } catch (err) {
            console.error('Error adding department:', err);
        }
    }

    async deleteDepartment(req) {
        // Take req passed from cli.handleAdditionalInput and insert into prepared statement to delete department
        try {
            const [rows, fields] = await connection.promise().execute(
                'DELETE FROM departments WHERE name = ?',
                [req]
            );
    
            // If department names don't match, no rows should be affected; return error.
            // This should be redundant as departments are chosen from list
            if (rows.affectedRows === 0) {
                console.log(`Department '${req}' not found.`);
            } else {
                console.log(`Department '${req}' deleted successfully!`);
            }
        } catch (err) {
            console.error('Error deleting department:', err);
        }
    }

    // TO DO - create response for when a (new) department isn't using a budget (i.e. has no employees)
    async getDepartmentUsedBudget(departmentName) {
        // Get department budget used for slected apartment using prepared statement and req from cli.handleAdditionalInput
        // requires joining the three tables, getting sum of all salaries for employees in specified department.
        try {
            const [rows, fields] = await connection.promise().execute(`
                SELECT
                    departments.name AS department,
                    SUM(roles.salary) AS used_budget
                FROM
                    employees
                JOIN roles ON employees.role_id = roles.id
                JOIN departments ON roles.department_id = departments.id
                WHERE
                    departments.name = ?
                GROUP BY
                    departments.name;
            `, [departmentName]);
    
            console.table(rows);
        } catch (err) {
            console.error('Error getting department used budget:', err);
        }
    }

    
    async addRole(roleTitle, roleSalary, departmentName) {
        // As choices are presented using department names, first get corresponding department ID and then use that to create role
        try {
            // Look up Dep ID, await response
            const [DepRows, DepFields] = await connection.promise().execute(
                'SELECT id FROM departments WHERE name = ?',
                [departmentName]
            );

            // Set the departmentID as first (and only row) of results (results are always returned as arrays)
            const departmentId = DepRows[0].id;

            // Insert the role with the department ID
            const [roleRows, roleFields] = await connection.promise().execute(
                'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
                [roleTitle, roleSalary, departmentId]
            );

            console.log(`Role '${roleTitle}' added successfully!`);
        } catch (err) {
            console.error('Error adding role:', err);
        }
    }

    async deleteRole(req) {
        try {
            // Delete the role based on the provided title - same as deleteDepartment() above
            const [rows, fields] = await connection.promise().execute(
                'DELETE FROM roles WHERE title = ?',
                [req]
            );
    
            // Again, probably redundant
            if (rows.affectedRows === 0) {
                console.log(`Role '${req}' not found.`);
            } else {
                console.log(`Role '${req}' deleted successfully!`);
            }
        } catch (err) {
            console.error('Error deleting role:', err);
        }
    }

    async getEmployeesByManager(req) {
        // first split at space the concocted manager name into first and last names
        const [managerFirstName, managerLastName] = req.split(' ');
    
        // Split the query and append WHERE depending on whether or not req = 'no manager'
        try {
            let query = `
                SELECT
                employees.id,
                employees.first_name,
                employees.last_name,
                roles.title AS job_title,
                departments.name AS department,
                roles.salary
                FROM employees
                JOIN roles ON employees.role_id = roles.id
                JOIN departments ON roles.department_id = departments.id
                `;
    
            // Check if 'No Manager' is selected
            if (req.toLowerCase() === 'no manager') {
                query += 'WHERE manager_id IS NULL';
            } else {
                // 'No Manager' is not selected, filter by manager name
                query += 'WHERE manager_id IN (SELECT id FROM employees WHERE first_name = ? AND last_name = ?)';
            }
    
            const [rows, fields] = await connection.promise().execute(query, [managerFirstName, managerLastName]);
    
            console.log(`Employees managed by '${req}':`)
            console.table(rows);
        } catch (err) {
            console.error('Error fetching employees by manager:', err);
        }
    }

    async getEmployeesByDepartment(req) {
        try {
            const [rows, fields] = await connection.promise().query(`
                SELECT
                    employees.id,
                    employees.first_name,
                    employees.last_name,
                    roles.title AS job_title,
                    roles.salary,
                    CONCAT(managers.first_name, ' ', managers.last_name) AS manager
                FROM employees
                JOIN roles ON employees.role_id = roles.id
                JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees AS managers ON employees.manager_id = managers.id
                WHERE departments.name = ?`,
                [req]
            );
            console.log(`Employees in the department '${req}':`)
            console.table(rows);
        } catch (err) {
            console.error('Error fetching employees by department:', err);
        }
    }

    // TODO in future: This could be refactored by using subqueries, i.e. nesting SELECTs within INSERT
    async addEmployee(firstName, lastName, roleTitle, managerName) {

        try {
            // Get ID of role corresponding to selected title from db
            const [roleRows, roleFields] = await connection.promise().execute(
                'SELECT id FROM roles WHERE title = ?',
                [roleTitle]
            );
            const roleId = roleRows[0].id;
    
            let managerId = null;
    
            // Check if manager name is not 'None', find matching ID (otherwise null will be INSERTed below)
            if (managerName.toLowerCase() !== 'none') {
                // Split the names selected from list to match DB format
                const [managerFirstName, managerLastName] = managerName.split(' ');
    
                // Get the ID of the manager based on first and last name
                const [managerRows, managerFields] = await connection.promise().execute(
                    'SELECT id FROM employees WHERE first_name = ? AND last_name = ?',
                    [managerFirstName, managerLastName]
                );
    
                //Update manager ID with first-row result
                managerId = managerRows[0].id;
            }
    
            // Using name entered and fields selected/process above, try to add an employee
            const [employeeRows, employeeFields] = await connection.promise().execute(
                'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                [firstName, lastName, roleId, managerId]
            );
    
            console.log(`Employee '${firstName} ${lastName}' added successfully!`);
        } catch (err) {
            console.error('Error adding employee:', err);
        }
    }
        

}
  
  


module.exports = Queries;
