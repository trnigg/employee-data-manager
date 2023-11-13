// MODULES required for this application

const inquirer = require('inquirer');
const Prompts = require('./prompts');
const Switcher = require('./switcher');

class CLI {
    constructor() {
        this.prompts = new Prompts(); // Create an instance of the Prompts
        this.switcher = new Switcher(); // Create an instance of the Prompts
    };

    handleMainMenu() {
        inquirer
            .prompt(this.prompts.confirmConnection)
            .then((res) => {
                if (res.confirmConnection) {
                    inquirer
                        .prompt(this.prompts.menu)
                        .then ((res) => {
                            console.log(res);
                            this.switcher.handleMenuChoices(res.mainMenu, res.subMenu);
                        }) 
                } else {
                    console.log('EXITED PLACEHOLDER TEXT');
                }
            })
    };

    run() {
        console.log(this.prompts.welcome);
        this.handleMainMenu();
    };
};

module.exports = CLI;
