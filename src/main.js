import inquirer from 'inquirer';
import chalk from 'chalk';

export async function askForNoteContent(options) {
    const answer = await inquirer.prompt({
        type: 'input',
        name: 'content',
        message: "Please write the content of the note: ",
    });
    return answer.content;
}

export async function writeContent(content, name) {
    var fs = require('fs');
    // var oldContent = fs.readFileSync("./notes/" + name + ".txt", 'utf8');
    // console.log(oldContent);
    fs.writeFileSync("./notes/" + name + ".txt", content);
}

export async function checkContent(name) {
    var fs = require('fs');
    try {
        var oldContent = fs.readFileSync("./notes/" + name + ".txt", 'utf8');
        console.log(oldContent);
    } catch(e) {
        console.log(chalk.red.bold("ERROR 404"));
        process.exit(1);
    }
    
}

export async function continueContent(content, name, options) {
    var fs = require('fs');
    try {
        var oldContent = fs.readFileSync("./notes/" + name + ".txt", 'utf8');
        console.log("This is the old content: \n" + oldContent);
        var newContent = await askForNoteContent(options);
        fs.writeFileSync("./notes/" + name + ".txt", newContent);
    } catch(e) {
        console.log(chalk.red.bold("ERROR 404"));
        process.exit(1);
    }
    
}

export async function main(options) {
    if(options.create) {
        var content = await askForNoteContent(options);
        await writeContent(content, options.name);
    } else {
        if(options.check) {
            await checkContent(options.name);
        } else {
            if(options.continue) {
                await continueContent(content, options.name, options);
            }
        }
    }
    console.log(chalk.green.bold("DONE"));
}

