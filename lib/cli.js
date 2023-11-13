// MODULES required for this application

const inquirer = require('inquirer');

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
                        .prompt(this.prompts.menu)
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
