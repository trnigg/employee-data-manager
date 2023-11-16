// MODULES 
const Queries = require('../db/queries'); // Required to update choice arrays



class Prompts {
    constructor() {

        // CONSTRUCTED QUESTION OBJECTS
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
                name: 'deleteThisDepartment',
                message: 'Which department would you like to delete?',
                choices: [], // Array generated dynamically by updateChoiceArrays() method
        };

        this.viewDepartmentBudgetUsed = {
            type: 'list',
                name: 'departmentBudgetUsed',
                message: 'Which department would you like to view the utilised budget of?',
                choices: [], // Array generated dynamically by updateChoiceArrays() method
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
                validate: (newRoleSalary) => this.salaryInputValidator(newRoleSalary), // Using method to valdiate below
            },
            {
                type: 'list',
                name: 'newRoleDepartment',
                message: 'Which department does your new role belong to?',
                choices: [], // Array generated dynamically by updateChoiceArrays() method
            },
        ]

        this.deleteRole = {
            type: 'list',
            name: 'deleteThisRole',
            message: 'Which role would you like to delete?',
            choices: [], // Array generated dynamically by updateChoiceArrays() method
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
                choices: [], // Array generated dynamically by updateChoiceArrays() method
            },
            {
                type: 'list',
                name: 'newEmployeeManager',
                message: "Who is your new employee's manager?",
                choices: [], // Array generated dynamically by updateChoiceArrays() method
            },
        ]

        this.updateEmployeeRole = [
            {
                type: 'list',
                name: 'updateWhichEmployeesRole',
                message: "Which employee's role would you like to update?",
                choices: [], // Array generated dynamically by updateChoiceArrays() method
            },
            {
                type: 'list',
                name: 'updatedEmployeeRole',
                message: "What is your employee's new role?",
                choices: [], // Array generated dynamically by updateChoiceArrays() method
            },
        ]

        this.updateEmployeeManager = [
            {
                type: 'list',
                name: 'updateWhichEmployeesManager',
                message: "Which employee's manager would you like to update?",
                choices: [], // Array generated dynamically by updateChoiceArrays() method
            },
            {
                type: 'list',
                name: 'updatedEmployeesmanager',
                message: "Who is your employee's new manager?",
                choices: [], // Array generated dynamically by updateChoiceArrays() method
            },
        ]

        this.deleteEmployee = {
            type: 'list',
                name: 'deleteThisEmployee',
                message: 'Which employee would you like to delete?',
                choices: [], // Array generated dynamically by updateChoiceArrays() method
        };


        this.viewEmployeesByManager = {
            type: 'list',
                name: 'viewThisManagerEmployees',
                message: 'Which manager would you like to view employees by?',
                choices: [], // Array generated dynamically by updateChoiceArrays() method
        };

        this.viewEmployeesByDepartment = {
            type: 'list',
                name: 'viewThisDepartmentEmployees',
                message: "Which department's employees would you like to view?",
                choices: [], // Array generated dynamically by updateChoiceArrays() method
        };
    };

    

    // METHOD TO UPDATE CHOICE_ARRAYS LEVERAGING QUERIES MODULE 
    async updateChoiceArrays() {
        // CREATE AN INSTANCE TO USE QUERIES METHOD TO GET UPDATED ARRAYS 
        const queries = new Queries();
        const { employeeArray, roleArray, managerArray, departmentArray } = await queries.updateChoiceArrays();

            // ASSIGN ARRAYS TO SPECIFIC PROMPTS
            this.deleteDepartment.choices = departmentArray;
            this.viewDepartmentBudgetUsed.choices = departmentArray;
            this.deleteRole.choices = roleArray;
            this.addRole[2].choices = departmentArray;
            this.addEmployee[2].choices = roleArray; // Update choices for newEmployeeRole
            this.addEmployee[3].choices = [...employeeArray, 'NO MANAGER']; // added NONE to choices for newEmployeeManager by creating new array spreading all employees and NONE
            this.updateEmployeeRole[0].choices = employeeArray; //  updateWhichEmployeesRole
            this.updateEmployeeRole[1].choices = roleArray; // updatedEmployeeRole
            this.updateEmployeeManager[0].choices = employeeArray; // Update choices for updateWhichEmployeesManager
            this.updateEmployeeManager[1].choices = [...employeeArray, 'NO MANAGER']; // Update choices for updatedEmployeesmanager
            this.deleteEmployee.choices = employeeArray;
            this.viewEmployeesByManager.choices = [...managerArray, 'NO MANAGER']; // New array spreading only employees managing others, plus 'no manager' to rep employees with manager = null
            this.viewEmployeesByDepartment.choices = departmentArray;
    }

    // METHOD TO VALIDATE SALARY AS AN INTEGER
    salaryInputValidator(input) {
        if (!input.trim().length) {
            return 'Salary cannot be empty. Please enter a valid integer as the salary.';
        }

        // Test using regex to ensure string contains only numbers
        // https://pandaquests.medium.com/5-easy-ways-to-check-if-a-string-contains-only-numbers-in-javascript-305db38625e8#:~:text=The%20RegExp%20pattern%20%2F%5E%5Cd,the%20string%20and%20false%20otherwise.
        const isValidInteger = /^\d+$/.test(input);

        if (isValidInteger) {
            return true; // It's an integer
        } else {
            return 'Please enter the salary as an integer, using only numbers.';
        }
    }
};

module.exports = Prompts;
