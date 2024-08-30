import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradient from 'gradient-string'
import { createSpinner } from "nanospinner";

const resolveAnimations = (ms = 3000) => new Promise((resolve) => setTimeout(resolve, ms));

const spinner = createSpinner('Let me get that info for you...')

const outerwear = [
    "North Face puffer jacket (black)",
    "Patagonia fleece jacket (grey)",
    "Columbia raincoat (blue)",
    "Canada Goose parka (green)",
    "Barbour waxed jacket (olive)"
];

const tops = [
    "Ralph Lauren polo shirt (navy)",
    "Tommy Hilfiger t-shirt (white)",
    "H&M henley shirt (black)",
    "Uniqlo oxford shirt (blue)",
    "Zara sweater (grey)",
    "Gap hoodie (red)",
    "Calvin Klein tank top (white)",
    "Banana Republic dress shirt (light blue)",
    "Nike sports jersey (black)",
    "Adidas track jacket (green)"
];

const bottoms = [
    "Levi's jeans (dark wash)",
    "Dockers chinos (khaki)",
    "Nike athletic shorts (black)",
    "Under Armour joggers (grey)",
    "Ralph Lauren cargo pants (olive)",
    "H&M slim-fit pants (navy)",
    "Zara trousers (charcoal)",
    "Gap shorts (beige)",
    "Banana Republic slacks (black)",
    "Uniqlo jeans (light wash)"
];

const shoes = [
    "Nike running shoes (black)",
    "Adidas sneakers (white)",
    "Clarks desert boots (brown)",
    "Timberland work boots (tan)",
    "Cole Haan dress shoes (black)"
];

const figletPromise = (text) => new Promise((resolve, reject) => {
    figlet(text, (err, data) => {
        if (err) {
            return reject(err);
        }
        resolve(data);
    });
});

async function startProgram() {
    const introText = await figletPromise('Alfred');
    console.log(gradient.retro(introText));
    await resolveAnimations(); 
    const welcomeMsg = chalkAnimation.karaoke(`Hello! I'm Alfred, your personal butler `);
    await resolveAnimations();
    welcomeMsg.stop();

    await menu()
}

async function menu() {
    const answers = await inquirer.prompt({
        name: 'menu_choice',
        type: 'list',
        message: `\tHow may I assist you today?\n`,
    choices: [
        { name:'\tWeather outside today', value: 'weather' },
        { name: '\tPick an outfit for me', value: 'outfit' },
        { name: '\tView wardrobe', value: 'wardrobe' },
        { name: '\tExit', value: 'exit' }
    ],
    });
    if(answers.menu_choice === 'weather'){
        spinner.start();
        await resolveAnimations();
        spinner.success({ text: `Here's the info you requested.\n`});
        await weather();
    }
    else if(answers.menu_choice === 'outfit'){
        await outfit();
    }
    else if(answers.menu_choice === 'wardrobe') {
        displayItems();
    }
    else {
        return;
    }
}

async function menuOrQuit() {
    const answer = await inquirer.prompt({
        name: 'menu_or_quit',
        type: 'list',
        message: `\tReturn to menu or quit?\n`,
    choices: [
        { name:'\tMenu', value: 'menu' },
        { name: '\tQuit', value: 'quit' }
    ],
    });
    console.clear();
    if (answer.menu_or_quit === 'menu'){
        await menu();
    }
    else {
        return;
    }
}

async function weather() {
    //Get weather data from API (OpenWeatherMap) if you have time
    console.log('Today the temperature will be between 74 and 95 degrees.\nThere is a 15% chance of precipitation.\n');
    await menuOrQuit();
}

async function outfit() {
    let happy = false;
    while(!happy) {
        generateOutfit();
        const answer = await inquirer.prompt({
            name: 'outfit_approval',
            type: 'list',
            message: `\tDo you like it?\n`,
        choices: [
            { name:'\tYes, I like it', value: 'yes' },
            { name: '\tNo, give me another one', value: 'no' }
        ],
        });
        console.clear();
        if(answer.outfit_approval === 'yes'){
            happy = true;
        }
    }
    await menuOrQuit();
}

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const generateOutfit = () => {
    const chosenOuterwear = getRandomItem(outerwear);
    const chosenTop = getRandomItem(tops);
    const chosenBottom = getRandomItem(bottoms);
    const chosenShoes = getRandomItem(shoes);

    console.log("\nHere is an outfit that I selected for you:");
    console.log(`\tOuterwear (Optional): ${chosenOuterwear}`);
    console.log('\t\tConsider outerwear depending on the current weather.');
    console.log(`\tTop: ${chosenTop}`);
    console.log(`\tBottom: ${chosenBottom}`);
    console.log(`\tShoes: ${chosenShoes}\n`);
};

async function displayItems() {
    let doneAdding = false;
    while(!doneAdding){
        console.log(chalk.bgCyan.white.bold(' Outerwear '));
        outerwear.forEach(item => console.log(chalk.cyan(item)));

        console.log('\n' + chalk.bgYellow.black.bold(' Tops '));
        tops.forEach(item => console.log(chalk.yellow(item)));
        
        console.log('\n' + chalk.bgGreen.white.bold(' Bottoms '));
        bottoms.forEach(item => console.log(chalk.green(item)));
        
        console.log('\n' + chalk.bgMagenta.white.bold(' Shoes '));
        shoes.forEach(item => console.log(chalk.magenta(item)));

        const answer = await inquirer.prompt({
            name: 'add_item',
            type: 'list',
            message: `\tWould you like to add another item?\n`,
        choices: [
            { name:'\tYes', value: 'yes' },
            { name: '\tNo', value: 'no' }
        ],
        });
        if(answer.add_item === 'yes'){
            const choice = await inquirer.prompt({
                name: 'item_choice',
                type: 'list',
                message: `\tWhich category would you like to add the item to?\n`,
            choices: [
                { name: '\tOuterwear', value: 'outerwear' },
                { name: '\tTops', value: 'tops' },
                { name: '\tBottoms', value: 'bottoms' },
                { name: '\tShoes', value: 'shoes' }
            ],
            });

            const itemAnswer = await inquirer.prompt({
                name: 'item',
                type: 'input',
                message: `\tPlease enter the item to add:\n`,
            });

            if (choice.item_choice === 'outerwear') {
                outerwear.push(itemAnswer.item);
            } else if (choice.item_choice === 'tops') {
                tops.push(itemAnswer.item);
            } else if (choice.item_choice === 'bottoms') {
                bottoms.push(itemAnswer.item);
            } else if (choice.item_choice === 'shoes') {
                shoes.push(itemAnswer.item);
            }
        }
        const addAgain = await inquirer.prompt({
            name: 'again',
            type: 'list',
            message: `\tAre you done adding items?\n`,
        choices: [
            { name: '\tYes', value: 'yes' },
            { name: '\tNo', value: 'no' }
        ],
        });

        if (addAgain.again === 'yes'){
            doneAdding = true;
        }
        if (addAgain.again === 'no'){
            doneAdding = false;
        }

    }

    await menuOrQuit();
}


async function main() {
    await startProgram();
    
}

main()