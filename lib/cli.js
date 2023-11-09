// MODULES required for this application

const inquirer = require('inquirer');
const TreePrompt = require('inquirer-tree-prompt');
inquirer.registerPrompt('tree', TreePrompt);

const Prompts = require('./prompts');

class CLI {
    constructor() {
        this.prompts = new Prompts(); // Create an instance of the Prompts
    };

    run() {
        console.log(this.prompts.welcome);
        inquirer
            .prompt(this.prompts.confirmConnection)
            .then((res) => {
                if (res.confirmConnection) {
                    inquirer
                        .prompt(this.prompts.mainMenu)
                        .then ((res) => {
                            console.log(res);
                        }) 
                } else {
                    console.log('EXITED PLACEHOLDER TEXT');
                }
            })
    };
};

module.exports = CLI;
