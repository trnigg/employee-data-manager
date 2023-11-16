
// Module for queries/prepared statments
const mysql = require('mysql2');
// mysql2 
        // docs on prepared statements:
            // https://www.npmjs.com/package/mysql2?activeTab=readme#using-prepared-statements
        // on promise-wrapper to upgrade non promise connection to promise:
            // https://www.npmjs.com/package/mysql2/v/3.6.3#using-promise-wrapper
    // MySQL doc for queries:
        // https://dev.mysql.com/doc/refman/8.0/en/select.html

// My module for formatting query-results
const displayTable = require('../lib/tables');

// Module for changing console.log colours:
const chalk = require('chalk')

// using createConnection instead of pooling as only one simultanous connection to the db is required.
    // https://stackoverflow.com/questions/18496540/node-js-mysql-connection-pooling?rq=3


const connection = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "!System500",
      database: "hr_db",
    },
  );
  
class Queries {

    getAllDepartments() {
        // Query to show department id and department names
        connection.promise().query('SELECT * FROM departments')
            .then( ([rows,fields]) => {
                displayTable(rows);
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
                displayTable(rows);
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
                displayTable(rows);
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

            console.log(chalk.green(`Department ${chalk.cyan.bold(req)} successfully added!`));
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
                console.log(chalk.green(`Department ${chalk.cyan.bold(req)} successfully deleted!`));
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
    
            displayTable(rows);
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

            console.log(chalk.green(`Role ${chalk.cyan.bold(roleTitle)} successfully added!`));
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
                console.log(chalk.green(`Role ${chalk.cyan.bold(req)} successfully deleted!`));
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
    
            displayTable(rows);
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
            displayTable(rows);
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
    
            // Check if manager name is not 'NO MANAGER', find matching ID (otherwise null will be INSERTed below)
            if (managerName.toLowerCase() !== 'no manager') {
                // Split the names selected from list to match DB format
                const [managerFirstName, managerLastName] = managerName.split(' ');
    
                // Get the ID of the manager based on first and last name
                const [managerRows, managerFields] = await connection.promise().execute(
                    'SELECT id FROM employees WHERE first_name = ? AND last_name = ?',
                    [managerFirstName, managerLastName]
                );
    
                // Update manager ID with first-row result
                managerId = managerRows[0].id;
            }
    
            // Using name entered and fields selected/process above, try to add an employee
            const [employeeRows, employeeFields] = await connection.promise().execute(
                'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                [firstName, lastName, roleId, managerId]
            );
    
            console.log(chalk.green(`Employee ${chalk.cyan.bold(firstName + lastName)} succesfully added!`));
        } catch (err) {
            console.error('Error adding employee:', err);
        }
    }
        
    async updateEmployeeRole(employeeName, newRoleTitle) {
        // Split the employee name
        const [employeeFirstName, employeeLastName] = employeeName.split(' ');
    
        try {
            // Get the ID of the new role corresponding to the selected title
            const [roleRows, roleFields] = await connection.promise().execute(
                'SELECT id FROM roles WHERE title = ?',
                [newRoleTitle]
            );
            const roleId = roleRows[0].id;
    
            // Update the employee's role
            await connection.promise().execute(
                'UPDATE employees SET role_id = ? WHERE first_name = ? AND last_name = ?',
                [roleId, employeeFirstName, employeeLastName]
            );
    
            console.log(chalk.green(`Employee ${chalk.cyan.bold(employeeFirstName + employeeLastName)}'s role succesfully updated!`));
        } catch (err) {
            console.error('Error updating employee role:', err);
        }
    }

    async updateEmployeeManager(employeeName, newManagerName) {
        // first split the employee name into first and last names
        const [employeeFirstName, employeeLastName] = employeeName.split(' ');
    
        let newManagerId = null;
    
        // Check if 'No Manager' is selected
        if (newManagerName.toLowerCase() !== 'no manager') {
            // Split the names selected from the list to match the DB format
            const [managerFirstName, managerLastName] = newManagerName.split(' ');
    
            // Get the ID of the new manager based on first and last name
            const [managerRows, managerFields] = await connection.promise().execute(
                'SELECT id FROM employees WHERE first_name = ? AND last_name = ?',
                [managerFirstName, managerLastName]
            );
    
            // Update manager ID with first-row result
            newManagerId = managerRows[0].id;
        }
    
        try {
            // Update the employee's manager
            await connection.promise().execute(
                'UPDATE employees SET manager_id = ? WHERE first_name = ? AND last_name = ?',
                [newManagerId, employeeFirstName, employeeLastName]
            );
    
            console.log(chalk.green(`Employee ${chalk.cyan.bold(employeeFirstName + employeeLastName)}'s manager succesfully updated!`));
        } catch (err) {
            console.error('Error updating employee manager:', err);
        }
    }

    async deleteEmployee(employeeName) {
        // Split employee name
        const [employeeFirstName, employeeLastName] = employeeName.split(' ');
    
        try {
            // Delete the employee from the database
            await connection.promise().execute(
                'DELETE FROM employees WHERE first_name = ? AND last_name = ?',
                [employeeFirstName, employeeLastName]
            );
    
            console.log(chalk.green(`Employee ${chalk.cyan.bold(employeeFirstName + employeeLastName)} succesfully deleted!`));
        } catch (err) {
            console.error('Error deleting employee:', err);
        }
    }


}
  
module.exports = Queries;
