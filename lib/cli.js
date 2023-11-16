// 3rd PARTY MODULES
const inquirer = require('inquirer'); // Module to run prompts
const chalk = require('chalk'); // Module to colour console.logs()

// MY MODULES
const Prompts = require('./prompts'); // Module for questions used in prompts
const Queries = require('../db/queries'); // Module to handle queries and display results

// CREATE INSTANCES OF MY MODULES - done outside of scope of CLI class for brevity/clarity
const queries = new Queries();
const prompts = new Prompts();


// CLASS TO HANDLE CLI LOGIC - exported to index.js
class CLI {

// METHOD TO RUN APP
    async run() {
        // Display Welcome Message
        console.log(chalk.green(`Welcome to the ${chalk.cyan.bold('Employee Database Management System')}`));

        // TRY Connection Prompt. IF res = yes/true THEN show connection message & runMenu() ELSE exit(). CATCH in case of err.
        try {
            const res = await inquirer.prompt(prompts.confirmConnection);
            if (res.confirmConnection) {
                console.log(chalk.green(`Connected to the ${chalk.cyan.bold('Employee Database Management System')}`));
                await this.runMenu();
            } else {
                this.exit();
            }
        } catch (err) {
            console.error('An error occurred:', err);
        }
    }

    // METHOD TO HANDLE MENU SEQUENCE
    async runMenu() {
        // Awaits prompts to be updated with data for drop-down choices before continuing
        await prompts.updateChoiceArrays();
        // Awaits choices from the menu to be returned before handling them
        const res = await inquirer.prompt(prompts.menu);
        // Handle choices from the menu
        this.handleMenuChoices(res.mainMenu, res.subMenu);
    };    

    // METHOD TO HANDLE EXITING FROM APP
    exit() {
        // Display Exit Message
        console.log(chalk.redBright(`Exiting the ${chalk.cyan.bold('Employee Database Management System')}\nTo reconnect, please enter ${chalk.yellow('node index.js')}`));
        // Exit process
        process.exit();
    };

    // METHOD TO HANDLE PROMPTS & RETURN INPUT WHERE MORE ARE REQUIRED
    async handleAdditionalInput(morePrompts){
        // Await additional (choice-specific) prompts to be asked and answered before returning responses
        const res = await inquirer.prompt(morePrompts);
        return res;
    };

    // METHOD TO HANDLE CHOICES FROM MENU - works as a switchboard to call additional prompts if need, and make appropriate queries
    async handleMenuChoices(mainMenuChoice, subMenuChoice) {
        switch (mainMenuChoice) {
            case 'View all departments':
                queries.getAllDepartments();
                break;

            case 'Manage department':
                switch (subMenuChoice) {
                    case 'Add a department':
                        const addDepartmentRes = await this.handleAdditionalInput(prompts.addDepartment);
                        await queries.addDepartment(addDepartmentRes.newDepartmentName);
                        break;
                    case 'Delete a department':
                        const delDepartmentRes = await this.handleAdditionalInput(prompts.deleteDepartment);
                        await queries.deleteDepartment(delDepartmentRes.deleteThisDepartment);
                        break;
                    case 'View utilised budget of a department':
                        const viewDepartmentBudgetRes = await this.handleAdditionalInput(prompts.viewDepartmentBudgetUsed);
                        await queries.getDepartmentUsedBudget(viewDepartmentBudgetRes.departmentBudgetUsed);
                        break;
                    case 'RETURN':
                        console.log(chalk.green('Returned to main menu'));
                        break;
                    default:
                        console.log('Invalid choice');
                }
                break;
                
            case 'View all roles':
                queries.getAllRoles();
                break;
            
            case 'Manage role':
                switch (subMenuChoice) {
                    case 'Add a role':
                        const addRoleRes = await this.handleAdditionalInput(prompts.addRole);
                        await queries.addRole(addRoleRes.newRoleName, addRoleRes.newRoleSalary, addRoleRes.newRoleDepartment);
                        break;
                    case 'Delete a role':
                        const deleteRoleRes = await this.handleAdditionalInput(prompts.deleteRole);
                        await queries.deleteRole(deleteRoleRes.deleteThisRole);
                        break;
                    case 'RETURN':
                        console.log(chalk.green('Returned to main menu'));
                        break;
                    // Add more cases for other sub-menu choices
                    default:
                        console.log('Invalid choice');
                }
                break;

            case 'View employees':
                switch (subMenuChoice) {
                    case 'View all employees':
                        queries.getAllEmployees();
                        break;
                    case 'View employees by manager':
                        const viewByManagerRes = await this.handleAdditionalInput(prompts.viewEmployeesByManager);
                        await queries.getEmployeesByManager(viewByManagerRes.viewThisManagerEmployees);
                        break;
                    case 'View employees by department':
                        const viewByDepartmentRes = await this.handleAdditionalInput(prompts.viewEmployeesByDepartment);
                        await queries.getEmployeesByDepartment(viewByDepartmentRes.viewThisDepartmentEmployees);
                        break;
                    case 'RETURN':
                        console.log(chalk.green('Returned to main menu'));
                        break;
                    default:
                        console.log('Invalid choice');
                }
                break;
            
            case 'Manage employee':
                switch (subMenuChoice) {
                    case "Add an employee":
                        const addEmployeeRes = await this.handleAdditionalInput(prompts.addEmployee);
                        await queries.addEmployee(
                            addEmployeeRes.newEmployeeFirstName,
                            addEmployeeRes.newEmployeeLastName,
                            addEmployeeRes.newEmployeeRole,
                            addEmployeeRes.newEmployeeManager
                            );
                        break;
                    case "Update employee's role":
                        const updatedEmployeeRoleRes = await this.handleAdditionalInput(prompts.updateEmployeeRole);
                        await queries.updateEmployeeRole(updatedEmployeeRoleRes.updateWhichEmployeesRole, updatedEmployeeRoleRes.updatedEmployeeRole);
                        break;
                    case "Update employee's manager":
                        const updateEmployeeManagerRes = await this.handleAdditionalInput(prompts.updateEmployeeManager);
                        await queries.updateEmployeeManager(updateEmployeeManagerRes.updateWhichEmployeesManager, updateEmployeeManagerRes.updatedEmployeesmanager);
                        break;
                    case "Delete an employee":
                        const deleteEmployeeRes = await this.handleAdditionalInput(prompts.deleteEmployee);
                        await queries.deleteEmployee(deleteEmployeeRes.deleteThisEmployee);
                        break;
                    case "RETURN":
                        console.log(chalk.green('Returned to main menu'));
                        break;
                    // Add more cases for other sub-menu choices
                    default:
                        console.log('Invalid choice');
                }
                break;

            case 'EXIT':
                this.exit();
                return;

            default:
                console.log('Invalid choice');
        }
    
    this.runMenu(); // Call outside the Switch Cases so that the main menu is always called at the end of each scenario, except EXIT.
    }
};

module.exports = CLI;
