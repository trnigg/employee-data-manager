// MODULES required for this application
//https://github.com/insightfuls/inquirer-tree-prompt
//https://stackoverflow.com/questions/45060200/in-node-js-how-do-i-create-a-prompt-loop-using-inquirer
const inquirer = require('inquirer');
const TreePrompt = require('inquirer-tree-prompt');
inquirer.registerPrompt('tree', TreePrompt);



class Prompts {
    constructor() {

        this.welcome = 'Welcome to the Employee Database Management System.';

        this.confirmConnection = {
            type: 'confirm',
            name: 'confirmConnection',
            message: 'Please confirm with "y" to establish a connection to the Employee Database:',
            default: false, 
        };

        this.mainMenu = {
            type: 'tree',
            name: 'mainOptions',
            message: 'What would you like to do?',
            tree: [
                    {
                        value: "View all departments",
                        open: false
                    },
                    {
                        value: "Manage department",
                        children: [
                            "Add a department",
                            "Delete a department",
                            "View utilised budget of a department"
                        ]
                    },
                    {
                        value: "View all roles",
                        open: false
                    },
                    {
                        value: "Manage roles",
                        open: true,
                        children: [
                            "Add a role",
                            "Delete a role"
                        ]
                    },
                    {
                        value: "View employees",
                        open: true,
                        children: [
                            "View all employees",
                            "View by manager",
                            "View by department"
                        ]
                    },
                    {
                        value: "Manage employees",
                        open: true,
                        children: [
                            "Add an employee",
                            "Update employee's role",
                            "Update employee's manager",
                            "Delete an employee"
                        ]
                    },
                    {
                        value: "EXIT",
                        open: false
                    }
            ]
        };

        this.addDepartment = {
            type: 'input',
            name: 'newDepartmentName',
            message: 'What is the new department called?',
            validate: (newDepartmentName) => (newDepartmentName.trim().length ? true : 'Cannot be left blank. Please enter a name for your new department.'),
        };

        this.deleteDepartment = {
            type: 'list',
                name: 'deleteThisDepartment',
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
            name: 'deleteThisRole',
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
