// MODULES required for this application
//https://github.com/insightfuls/inquirer-tree-prompt
//https://stackoverflow.com/questions/45060200/in-node-js-how-do-i-create-a-prompt-loop-using-inquirer
const inquirer = require('inquirer');
const mysql = require('mysql2/promise'); // MODULARISE AND REMOVE FROM HERE LATER



class Prompts {
    constructor() {

        // Choice arrays
        this.employeeArray = [];
        this.roleArray = [];
        this.managerArray = [];
        this.departmentArray = [];

        // Prompt/Question objects
        this.welcome = 'Welcome to the Employee Database Management System.';

        this.confirmConnection = {
            type: 'confirm',
            name: 'confirmConnection',
            message: 'Please confirm with "y" to establish a connection to the Employee Database:',
            default: false, 
        };

        this.menu = [
            {
                type: 'list',
                name: 'mainMenu',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'Manage department',
                    'View all roles',
                    'Manage role',
                    'View employees',
                    'Manage employee',
                    'EXIT'
                ]
            },
            {
                type: 'list',
                name: 'subMenu',
                message: 'What would you like to do?',
                choices: [
                    'Add a department',
                    'Delete a department',
                    'View utilised budget of a department',
                    'RETURN'
                ],
                when: (res) => res.mainMenu === 'Manage department',
            },
            {
                type: 'list',
                name: 'subMenu',
                message: 'What would you like to do?',
                choices: [
                    'Add a role',
                    'Delete a role',
                    'RETURN'
                ],
                when: (res) => res.mainMenu === 'Manage role',
            },
            {
                type: 'list',
                name: 'subMenu',
                message: 'How would you like to view employees?',
                choices: [
                    'View all employees',
                    'View employees by manager',
                    'View employees by department',
                    'RETURN'
                ],
                when: (res) => res.mainMenu === 'View employees',
            },
            {
                type: 'list',
                name: 'subMenu',
                message: 'What would you like to do?',
                choices: [
                    "Add an employee",
                    "Update employee's role",
                    "Update employee's manager",
                    "Delete an employee",
                    'RETURN'
                ],
                when: (res) => res.mainMenu === 'Manage employee',
            },
        ]       

        this.addDepartment = {
            type: 'input',
            name: 'newDepartmentName',
            message: 'What is the new department called?',
            validate: (newDepartmentName) => (newDepartmentName.trim().length ? true : 'Cannot be left blank. Please enter a name for your new department.'),
        };

        this.deleteDepartment = {
            type: 'list',
                name: 'deleteDepartment',
                message: 'Which department would you like to delete?',
                choices: this.departmentArray, // Array of current departments, generated dynamically,
        };

        this.viewDepartmentBudgetUsed = {
            type: 'list',
                name: 'departmentBudgetUsed',
                message: 'Which department would you like to view the utilised budget of?',
                choices: this.departmentArray, // Array of current departments, generated dynamically,
        };



        this.addRole = [
            {
                type: 'input',
                name: 'newRoleName',
                message: 'What is the new role called?',
                validate: (newRoleName) => (newRoleName.trim().length ? true : 'Cannot be left blank. Please enter a name for your new role.'),
            },
            {
                type: 'input',
                name: 'newRoleSalary',
                message: 'What is the salary of the new role?',
                validate: this.salaryInputValidator,
            },
            {
                type: 'list',
                name: 'newRoleDepartment',
                message: 'Which department does your new role belong to?',
                choices: this.departmentArray, // Array of current departments, generated dynamically
            },
        ]

        this.deleteRole = {
            type: 'list',
            name: 'deleteRole',
            message: 'Which role would you like to delete?',
            choices: this.roleArray, // Array of current roles, generated dynamically,
        };

        this.addEmployee = [
            {
                type: 'input',
                name: 'newEmployeeFirstName',
                message: "What is your new employee's first name?",
                validate: (newEmployeeFirstName) => (newEmployeeFirstName.trim().length ? true : 'Cannot be left blank. Please enter a first-name for your new employee.'),
            },
            {
                type: 'input',
                name: 'newEmployeeLastName',
                message: "What is your new employee's last name?",
                validate: (newEmployeeLastName) => (newEmployeeLastName.trim().length ? true : 'Cannot be left blank. Please enter a last-name for your new employee.'),
            },
            {
                type: 'list',
                name: 'newEmployeeRole',
                message: "What is your new employee's role?",
                choices: this.roleArray, // Array of current roles, generated dynamically
            },
            {
                type: 'list',
                name: 'newEmployeeManager',
                message: "Who is your new employee's manager?",
                choices: this.employeeArray, // Array of current EMPLOYEES (anyone can become a manager), generated dynamically
            },
        ]

        this.updateEmployeeRole = [
            {
                type: 'list',
                name: 'updateWhichEmployeesRole',
                message: "Which employee's role would you like to update?",
                choices: this.employeeArray, // Array of current employees, generated dynamically
            },
            {
                type: 'input',
                name: 'updatedEmployeeRole',
                message: "What is your employee's new role?",
                choices: this.roleArray, // Array of current roles, generated dynamically
            },
        ]

        this.updateEmployeeManager = [
            {
                type: 'list',
                name: 'updateWhichEmployeesManager',
                message: "Which employee's manager would you like to update?",
                choices: this.employeeArray, // Array of current employees, generated dynamically
            },
            {
                type: 'input',
                name: 'updatedEmployeesmanager',
                message: "Who is your employee's new manager?",
                choices: this.employeeArray, // Array of current EMPLOYEES (anyone can become a manager), generated dynamically
            },
        ]

        this.deleteEmployee = {
            type: 'list',
                name: 'deleteThisEmployee',
                message: 'Which employee would you like to delete?',
                choices: this.employeeArray, // Array of current employees, generated dynamically,
        };


        this.viewEmployeesByManager = {
            type: 'list',
                name: 'viewManagerEmployees',
                message: 'Which manager would you like to view employees by?',
                choices: this.managerArray, // Array of current managers, generated dynamically,
        };

        this.viewEmployeesByDepartment = {
            type: 'list',
                name: 'viewDepartmentEmployees',
                message: "Which department's employees would you like to view?",
                choices: this.roleArray, // Array of current roles, generated dynamically,
        };

        
    };

    

    // Functions to update CHoice arras TODO
    async updateChoiceArrays() {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '!System500',
            database: 'hr_db'
        });

        try {
            const employees = await db.query('SELECT CONCAT(first_name, " ", last_name) AS full_name FROM employees');
            const roles = await db.query('SELECT title FROM roles');
            const managers = await db.query('SELECT CONCAT(first_name, " ", last_name) AS manager_name FROM employees WHERE manager_id IS NOT NULL');
            const departments = await db.query('SELECT name FROM departments');
            console.log(employees);
            // Format data for inquirer choices
            this.employeeArray = employees[0].map(employee => employee.full_name);
            this.roleArray = roles[0].map(role => role.title);
            this.managerArray = managers[0].map(manager => manager.manager_name);
            this.departmentArray = departments[0].map(department => department.name);
            console.log(this.employeeArray);
            console.log(this.roleArray);
            console.log(this.managerArray);
            console.log(this.departmentArray);
        } catch (error) {
            console.error('Error updating choice arrays:', error);
        }
    }

    // Methods to Validate Data Entry

    salaryInputValidator(input) {
        if (!input.trim().length) {
            return 'Salary cannot be empty. Please enter a valid integer as the salary.';
        }

        const inputtedSalary = parseInt(input);

        if (Number.isInteger(inputtedSalary)) {
            return true; // It's an integer
        } else {
            return 'Please enter the salary as an integer.';
        }
      }
};

module.exports = Prompts;
