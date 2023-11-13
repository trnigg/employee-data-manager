class Switcher {
    constructor() {
        // Add initialization logic here - maybe db connection?
    }


    // possibly remove seperation of main and sub and combine?

    handleMenuChoices(mainMenuChoice, subMenuChoice) {
        console.log(mainMenuChoice,subMenuChoice);
        // Implement logic based on both main menu and sub-menu choices
        // Need to implement an IF statement to catch when submenu is undefined?
        switch (mainMenuChoice) {
            case 'View all departments':
                console.log('View all departments selected from main');
                break;

            case 'Manage department':
                console.log('manage departments selected from main');
                switch (subMenuChoice) {
                    case 'Add a department':
                        console.log('Add a department selected from sub');
                        break;
                    case 'Delete a department':
                        console.log('Delete a department selected from sub');
                        break;
                    case 'View utilised budget of a department':
                        console.log('View utilised budget of a department selected from sub');
                        break;
                    case 'RETURN':
                        console.log('RETURN selected from sub');
                        break;
                    default:
                        console.log('Invalid choice');
                }
                break;
                
            case 'View all roles':
                console.log('View all roles selected from main');
                break;
            
            case 'Manage role':
                console.log('manage role selected from main');
                switch (subMenuChoice) {
                    case 'Add a role':
                        console.log('Add a department selected from sub');
                        break;
                    case 'Delete a role':
                        console.log('Delete a department selected from sub');
                        break;
                    case 'RETURN':
                        console.log('RETURN selected from sub');
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
                        break;
                    case 'View employees by manager':
                        console.log('View employees by manager selected from sub');
                        break;
                    case 'View employees by department':
                        console.log('View employees by department selected from sub');
                        break;
                    case 'RETURN':
                        console.log('RETURN selected from sub');
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
                        break;
                    case "Update employee's role":
                        console.log("Update employee's role selected from sub");
                        break;
                    case "Update employee's manager":
                        console.log("Update employee's manager selected from sub");
                        break;
                    case "Delete an employee":
                        console.log("Delete an employee selected from sub");
                        break;
                    case "RETURN":
                        console.log("RETURN selected from sub");
                        break;
                    // Add more cases for other sub-menu choices
                    default:
                        console.log('Invalid choice');
                }
                break; 

            // Add more cases for other main menu choices
            default:
                console.log('Invalid choice');
        }
    }
}




//     handleMainMenuChoice(choice) {
//         // Implement logic based on the main menu choice
//         switch (choice) {
//             case 'View all departments':
//                 console.log('View all departments SELECTED');
//                 break;
//             case 'Manage department':
//                 console.log('manage departments SELECTED from main');
//                 break;
//             // Add more cases for other main menu choices
//             default:
//                 console.log('Invalid choice');
//         }
//     }

//     handleSubMenuChoice(mainMenuChoice, subMenuChoice) {
//         // Implement logic based on both main menu and sub-menu choices
//         switch (mainMenuChoice) {
//             case 'Manage department':
//                 switch (subMenuChoice) {
//                     case 'Add a department':
//                         console.log('Add a department selected from main');
//                         break;
//                     case 'Delete a department':
//                         console.log('Delete a department selected from main');
//                         break;
//                     // Add more cases for other sub-menu choices
//                     default:
//                         console.log('Invalid choice');
//                 }
//                 break;
//             // Add more cases for other main menu choices
//             default:
//                 console.log('Invalid choice');
//         }
//     }
// }

module.exports = Switcher;