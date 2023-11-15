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
        // Awaits prompts to be updated with data for drop-down choices before continuing
        await prompts.updateChoiceArrays();
        // Awaits choices from the menu to be returned before handling them
        const res = await inquirer.prompt(prompts.menu)
        console.log(res);
        this.handleMenuChoices(res.mainMenu, res.subMenu);
    };    


    exit() {
        console.log("Exiting the Employee Database Manager. Please use 'node index.js' to re-establish your connection.")
        process.exit();
    };

    async handleAdditionalInput(morePrompts){
        // Await additional (choice-specific) prompts to be asked and answered before returning responses
        const res = await inquirer.prompt(morePrompts);
        console.log(res);
        return res;
    };


    async handleMenuChoices(mainMenuChoice, subMenuChoice) {
        console.log(mainMenuChoice,subMenuChoice);
        // Implement logic based on both main menu and sub-menu choices
        // Need to implement an IF statement to catch when submenu is undefined?
        switch (mainMenuChoice) {
            case 'View all departments':
                console.log('View all departments selected from main');
                queries.getAllDepartments();
                break;

            case 'Manage department':
                console.log('manage departments selected from main');
                switch (subMenuChoice) {
                    case 'Add a department':
                        console.log('Add a department selected from sub');
                        const addDepartmentRes = await this.handleAdditionalInput(prompts.addDepartment);
                        await queries.addDepartment(addDepartmentRes.newDepartmentName);
                        break;
                    case 'Delete a department':
                        console.log('Delete a department selected from sub');
                        const delDepartmentRes = await this.handleAdditionalInput(prompts.deleteDepartment);
                        await queries.deleteDepartment(delDepartmentRes.deleteThisDepartment);
                        break;
                    case 'View utilised budget of a department':
                        console.log('View utilised budget of a department selected from sub');
                        const viewDepartmentBudgetRes = await this.handleAdditionalInput(prompts.viewDepartmentBudgetUsed);
                        await queries.getDepartmentUsedBudget(viewDepartmentBudgetRes.departmentBudgetUsed);
                        break;
                    case 'RETURN':
                        console.log('RETURNED to main menu');
                        break;
                    default:
                        console.log('Invalid choice');
                }
                break;
                
            case 'View all roles':
                console.log('View all roles selected from main');
                queries.getAllRoles();
                break;
            
            case 'Manage role':
                console.log('manage role selected from main');
                switch (subMenuChoice) {
                    case 'Add a role':
                        console.log('Add a role selected from sub');
                        const addRoleRes = await this.handleAdditionalInput(prompts.addRole);
                        await queries.addRole(addRoleRes.newRoleName, addRoleRes.newRoleSalary, addRoleRes.newRoleDepartment);
                        break;
                    case 'Delete a role':
                        console.log('Delete a role selected from sub');
                        const deleteRoleRes = await this.handleAdditionalInput(prompts.deleteRole);
                        await queries.deleteRole(deleteRoleRes.deleteThisRole);
                        break;
                    case 'RETURN':
                        console.log('RETURNED to main menu');
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
                        queries.getAllEmployees();
                        break;
                    case 'View employees by manager':
                        console.log('View employees by manager selected from sub');
                        const viewByManagerRes = await this.handleAdditionalInput(prompts.viewEmployeesByManager);
                        await queries.getEmployeesByManager(viewByManagerRes.viewThisManagerEmployees);
                        break;
                    case 'View employees by department':
                        console.log('View employees by department selected from sub');
                        const viewByDepartmentRes = await this.handleAdditionalInput(prompts.viewEmployeesByDepartment);
                        await queries.getEmployeesByDepartment(viewByDepartmentRes.viewThisDepartmentEmployees);
                        break;
                    case 'RETURN':
                        console.log('RETURNED to main menu');
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
                        const addEmployeeRes = await this.handleAdditionalInput(prompts.addEmployee);
                        await queries.addEmployee(
                            addEmployeeRes.newEmployeeFirstName,
                            addEmployeeRes.newEmployeeLastName,
                            addEmployeeRes.newEmployeeRole,
                            addEmployeeRes.newEmployeeManager
                            );
                        break;
                    case "Update employee's role":
                        console.log("Update employee's role selected from sub");
                        const updatedEmployeeRoleRes = await this.handleAdditionalInput(prompts.updateEmployeeRole);
                        await queries.updateEmployeeRole(updatedEmployeeRoleRes.updateWhichEmployeesRole, updatedEmployeeRoleRes.updatedEmployeeRole);
                        break;
                    case "Update employee's manager":
                        console.log("Update employee's manager selected from sub");
                        const updateEmployeeManagerRes = await this.handleAdditionalInput(prompts.updateEmployeeManager);
                        await queries.updateEmployeeManager(updateEmployeeManagerRes.updateWhichEmployeesManager, updateEmployeeManagerRes.updatedEmployeesmanager);
                        break;
                    case "Delete an employee":
                        console.log("Delete an employee selected from sub");
                        const deleteEmployeeRes = await this.handleAdditionalInput(prompts.deleteEmployee);
                        await queries.deleteEmployee(deleteEmployeeRes.deleteThisEmployee);
                        break;
                    case "RETURN":
                        console.log('RETURNED to main menu');
                        break;
                    // Add more cases for other sub-menu choices
                    default:
                        console.log('Invalid choice');
                }
                break;

            case 'EXIT':
                console.log('EXIT selected from main');
                this.exit();
                return;

            // Add more cases for other main menu choices
            default:
                console.log('Invalid choice');
        }
    // Refactored to call outside the Switch Cases so that the main menu is always called at the end of each scenario.
    // Avoids repetition of calling in each case.
    // (Won't be triggered by 'EXIT')
    this.runMenu();
    }
};

module.exports = CLI;
