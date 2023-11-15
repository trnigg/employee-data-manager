// MODULES required for this application

const inquirer = require('inquirer');
const Prompts = require('./prompts');
const Queries = require('../db/queries');
const mysql = require('mysql2'); // MODULARISE AND REMOVE FROM HERE LATER

const queries = new Queries();
const prompts = new Prompts();

class CLI {

    run() {
        console.log(prompts.welcome);
        inquirer
            .prompt(prompts.confirmConnection)
            .then((res) => {
                if (res.confirmConnection) {
                    this.runMenu();
                } else {
                    this.exit();
                }
            });
    }

    async runMenu() {
        await prompts.updateChoiceArrays();
        // TO DO - update syntax for consistency
        const res = await inquirer.prompt(prompts.menu)
        console.log(res);
        this.handleMenuChoices(res.mainMenu, res.subMenu);
    };    


    exit() {
        console.log("Exiting the Employee Database Manager. Please use 'node index.js' to re-establish your connection.")
        process.exit();
    };

    async handleAdditionalInput(morePrompts){
        const res = await inquirer.prompt(morePrompts);
        console.log(res);
        return res;
    };


    handleMenuChoices(mainMenuChoice, subMenuChoice) {
        console.log(mainMenuChoice,subMenuChoice);
        // Implement logic based on both main menu and sub-menu choices
        // Need to implement an IF statement to catch when submenu is undefined?
        switch (mainMenuChoice) {
            case 'View all departments':
                console.log('View all departments selected from main');
                queries.getAllDepartments();
                this.runMenu();
                break;

            case 'Manage department':
                console.log('manage departments selected from main');
                switch (subMenuChoice) {
                    case 'Add a department':
                        console.log('Add a department selected from sub');
                        this.handleAdditionalInput(prompts.addDepartment)
                            .then((res) => {
                                queries.addDepartment(res.newDepartmentName)
                                    .then(() => {
                                         this.runMenu();
                             })
                        });
                        break;
                    case 'Delete a department':
                        console.log('Delete a department selected from sub');
                        this.handleAdditionalInput(prompts.deleteDepartment);
                        break;
                    case 'View utilised budget of a department':
                        console.log('View utilised budget of a department selected from sub');
                        this.handleAdditionalInput(prompts.viewDepartmentBudgetUsed);
                        break;
                    case 'RETURN':
                        console.log('RETURNED to main menu');
                        this.runMenu();
                        break;
                    default:
                        console.log('Invalid choice');
                }
                break;
                
            case 'View all roles':
                console.log('View all roles selected from main');
                queries.getAllRoles();
                this.runMenu();
                break;
            
            case 'Manage role':
                console.log('manage role selected from main');
                switch (subMenuChoice) {
                    case 'Add a role':
                        console.log('Add a role selected from sub');
                        this.handleAdditionalInput(prompts.addRole);
                        break;
                    case 'Delete a role':
                        console.log('Delete a role selected from sub');
                        this.handleAdditionalInput(prompts.deleteRole);
                        break;
                    case 'RETURN':
                        console.log('RETURNED to main menu');
                        this.runMenu();
                        break;
                    // Add more cases for other sub-menu choices
                    default:
                        console.log('Invalid choice');
                }
                break;

            case 'View employees':
                console.log('View employees selected from main');
                switch (subMenuChoice) {
                    case 'View all employees':
                        console.log('View all employees selected from sub');
                        queries.getAllRoles();
                        this.runMenu();
                        break;
                    case 'View employees by manager':
                        console.log('View employees by manager selected from sub');
                        this.handleAdditionalInput(prompts.viewEmployeesByManager);
                        break;
                    case 'View employees by department':
                        console.log('View employees by department selected from sub');
                        this.handleAdditionalInput(prompts.viewEmployeesByDepartment);
                        break;
                    case 'RETURN':
                        console.log('RETURNED to main menu');
                        this.runMenu();
                        break;
                    // Add more cases for other sub-menu choices
                    default:
                        console.log('Invalid choice');
                }
                break;
            
            case 'Manage employee':
                console.log('Manage employee selected from main');
                switch (subMenuChoice) {
                    case "Add an employee":
                        console.log("Add an employee selected from sub");
                        this.handleAdditionalInput(prompts.addEmployee);
                        break;
                    case "Update employee's role":
                        console.log("Update employee's role selected from sub");
                        this.handleAdditionalInput(prompts.updateEmployeeRole);
                        break;
                    case "Update employee's manager":
                        console.log("Update employee's manager selected from sub");
                        this.handleAdditionalInput(prompts.updateEmployeeManager);
                        break;
                    case "Delete an employee":
                        console.log("Delete an employee selected from sub");
                        this.handleAdditionalInput(prompts.deleteEmployee);
                        break;
                    case "RETURN":
                        console.log('RETURNED to main menu');
                        this.runMenu();
                        break;
                    // Add more cases for other sub-menu choices
                    default:
                        console.log('Invalid choice');
                }
                break;

            case 'EXIT':
                console.log('EXIT selected from main');
                this.exit();
                break;

            // Add more cases for other main menu choices
            default:
                console.log('Invalid choice');
        }
    }
};

module.exports = CLI;
