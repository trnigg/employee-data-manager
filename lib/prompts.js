// MODULES required for this application
//https://github.com/insightfuls/inquirer-tree-prompt
//https://stackoverflow.com/questions/45060200/in-node-js-how-do-i-create-a-prompt-loop-using-inquirer
const inquirer = require('inquirer');



class Prompts {
    constructor() {

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
                choices: [], // Array of current departments, generated dynamically,
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
                choices: [], // Array of current departments, generated dynamically
            },
        ]

        this.deleteRole = {
            type: 'list',
            name: 'deleteRole',
            message: 'Which role would you like to delete?',
            choices: [], // Array of current roles, generated dynamically,
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
                choices: [], // Array of current roles, generated dynamically
            },
            {
                type: 'list',
                name: 'newEmployeeManager',
                message: "Who is your new employee's manager?",
                choices: [], // Array of current managers, generated dynamically
            },
        ]

        this.updateEmployeeRole = [
            {
                type: 'list',
                name: 'updateWhichEmployeesRole',
                message: "Which employee's role would you like to update?",
                choices: [], // Array of current employees, generated dynamically
            },
            {
                type: 'input',
                name: 'updatedEmployeeRole',
                message: "What is your employee's new role?",
                choices: [], // Array of current roles, generated dynamically
            },
        ]

        this.updateEmployeeManager = [
            {
                type: 'list',
                name: 'updateWhichEmployeesManager',
                message: "Which employee's manager would you like to update?",
                choices: [], // Array of current employees, generated dynamically
            },
            {
                type: 'input',
                name: 'updatedEmployeesmanager',
                message: "Who is your employee's new manager?",
                choices: [], // Array of current managers, generated dynamically
            },
        ]

        this.deleteEmployee = {
            type: 'list',
                name: 'deleteThisEmployee',
                message: 'Which employee would you like to delete?',
                choices: [], // Array of current employees, generated dynamically,
        };


        this.viewEmployeesByManager = {
            type: 'list',
                name: 'viewManagerEmployees',
                message: 'Which manager would you like to view employees by?',
                choices: [], // Array of current managers, generated dynamically,
        };

        this.viewEmployeesByDepartment = {
            type: 'list',
                name: 'viewDepartmentEmployees',
                message: "Which department's employee would you like to view?",
                choices: [], // Array of current roles, generated dynamically,
        };

    };

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
