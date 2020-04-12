import arg from 'arg';
import inquirer from 'inquirer';
import {main} from './main.js';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--create': Boolean,
            '--continue': Boolean,
            '--check': Boolean,
            '-cr': '--create',
            '-co': '--continue',
            '-ch': '--check',
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        create: args['--create'] || false,
        continue: args['--continue'] || false,
        check: args['--check'] || false,
        name: args._[0],
        content: ''
    }
}

async function promptForMissingOptions(options) {
    const defaultName = 'ToDo';
    
    const questions = [];
    if(!options.name) {
        questions.push({
            type: 'input',
            name: 'name',
            message: "Please choose a name for the note: ",
            default: defaultName,
        });
    }
    
    if(!options.create && !options.continue && !options.check) {
        questions.push({
            type: 'list',
            name: "action",
            message: "Please choose an action: ",
            choices: [
                'create',
                'continue',
                'check',
            ],
            default: "create",
        });
    }
    
    

    const answers = await inquirer.prompt(questions);
    var create = false;
    var cotinue = false;
    var check = false;
    if(answers.action == 'create') {
        create = true;
    } else {
        if(answers.action == 'continue') {
            cotinue = true;
        } else {
            check = true;
        }
    }
    return {
        ...options,
        create: options.create || create,
        continue: options.continue || cotinue,
        check: options.check || check,
        name: options.name || answers.name,
        content: answers.content,
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options  = await promptForMissingOptions(options);
    //console.log(options);
    main(options);
}