// Colors:
// Base: 00a2ff
// Warning: ff8400
// Error: ff7070

/**
 * Module Imports
 */

Array.prototype.contains = function (needle) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}



const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, Partials, GatewayIntentBits} = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
require('dotenv').config()
const wait = require('util').promisify(setTimeout);
const fs = require("fs");
const fetch = require("node-fetch");

const myIntents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.MessageContent]

const client = new Client({ disableMentions: "everyone", partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: myIntents});

var PREFIX = "!"

client.restarting = false;

const log = text => console.log(text)

//IDs of the account that can use internal commands
client.devs = ["191647893835350017", "225700324680269824"]

//Activity
client.statusText = "Stallion Squad"
client.statusType = "COMPETING"

//Check these directories at the bot start
client.searchDirectories = ["commands", "commands/selfRoles"]

client.login(process.env.BOT_TOKEN).then(r => log(`Login initialized`));
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();


// Reaction things (so that it can fetch channels and msgs at the start of the bot
let reactionChannel = "778618553275908129";
let reactionMsgs = ['787080813635567657', '859205200279371806'];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Client Events
 */
client.on("ready", async () => {
    let error = false;
    console.log(`${client.user.username} activated`);
    //Fetch Item Definitions from API
    await fetch("http://api.peekio.no/GetItemDefs.php?format=json", {method: "Get"})
        .then(res => res.json())
        .catch(e => {console.log(e);  error = true})
        .then(!error ? json => client.steamItems = JSON.parse(json.response.itemdef_json) : null);
    if(client.steamItems != null) {
        console.log(`Loaded ${client.steamItems.length} steam items`)
    }
    
    client.user.setActivity(`${client.statusText}`, { type: client.statusType, url: "https://www.twitch.tv/directory/game/Stallion%20Squad" });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
//const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
let commandFiles = [];
client.searchDirectories.forEach(i => {
    let files = readdirSync(join(__dirname, i)).filter((file) => file.endsWith(".js"));
    files.forEach(b => commandFiles.push(join(i, b)));
    })

let modules = commandFiles.flat();

log(`Found ${modules.length} modules`)
for (const file of modules) {
    const command = require(join(__dirname, `${file}`));
    client.commands.set(command.name, command);
    let moduleName = file.split("\\")
    log(`Loaded module "${moduleName[moduleName.length-1].split(".")[0]}"`)
}

client.on("messageCreate", async (message) => {
    if (!client.application?.owner) await client.application?.fetch();
    
    //overwrites the application slash commands with data
    if (message.content.toLowerCase() === '!8uy8983257983278t9ydhwehfieuwhufiwhu' && message.author.id === client.application?.owner.id) {
        const command = await client.application?.commands.set(data);
        message.react("783427378050629672").catch(e => console.log(e));
        console.log(command);
    }
    
    //return if the message is not in a guild or made by bot
    if (message.author.bot) return;
    if (!message.guild) return;

    if(message.content.startsWith("ratio") || message.content.endsWith("ratio")) {message.react("👍"); return;}
    
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(
                `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
            );
        }
    }
    
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
    if(command.enabled === false) {
        message.reply("This command is currently disabled.");
        return;
    }
    
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("There was an error executing that command.").catch(console.error);
    }
});

//Reaction add event
client.on("messageReactionAdd", async (reaction, user) => {
    if(reactionMsgs.contains(reaction.message.id)) {
        if(user.id === client.user.id) {return}

        //Give sneakpeak role
        if(reaction.message.id === "859205200279371806") {
            client.commands.get("selfRole-sneakpeak").execute(reaction, user)
        }
    }
})

//Reaction remove event
client.on("messageReactionRemove", async(reaction, user) =>{

})

//Join message
client.on('guildMemberAdd', async member => {
    const command =
        client.commands.get("velkommen-member") ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes("velkommen-member"));
    await member.guild.members.cache.get(member.id).roles.add(member.guild.roles.cache.get("668891845207785473"));
    await command.execute(member);
})

// Slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const interactCmd = interaction.commandName;
    const command =
        client.commands.get(interactCmd) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(interactCmd));
    await command.interaction(interaction);
});

//Modal commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const interactCmd = interaction.customId;
    const command =
        client.commands.get(interactCmd) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(interactCmd));
    await command.interaction(interaction);
});

//Modal input commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
    const interactCmd = interaction.customId;
    const command =
        client.commands.get(interactCmd) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(interactCmd));
    await command.interaction(interaction);
});

const data = [
    {
        name: 'ping',
        description: 'Checks Horsebot\'s response time to Discord',
    },
    {
        name: 'wiki',
        description: 'Displays wiki statistics',
    },
    {
        name: 'horse',
        description: 'Sends random image from thishorsedoesnotexist.com',
    },
    {
        name: 'item',
        description: 'Displays information about the Steam item',
        options: [{
            name: 'item',
            type: 'STRING',
            description: 'Item name or ItemDefID',
            required: true,
        },{
            name: 'advanced_mode',
            type: 'BOOLEAN',
            description: 'Show advanced data',
            required: false,
        }],
    },
    {
        name: 'inventory',
        description: 'Displays user\'s Steam inventory using SteamId64',
        options: [{
            name: 'steamid64',
            type: 'STRING',
            description: 'Specify SteamId64 you want to get inventory data from',
            required: true,
        }],
    },
    {
        name: 'inspect',
        description: 'Inspect user\'s Steam inventory using SteamId64',
        options: [{
            name: 'steamid64',
            type: 'STRING',
            description: 'Specify SteamId64 you want to get inventory data from',
            required: true,
        }],
    },
    {
        name: 'userinfo',
        description: 'Displays information about the user',
        options: [{
            name: 'user',
            type: 'USER',
            description: 'User that you want info about (leave empty if you want info about yourself)',
            required: false,
        }],
    },
    {
        name: 'suggest',
        description: 'Add a suggestion to the suggestions channel',
        options: [
            {
                name: 'platform',
                type: 'STRING',
                description: 'What platform do you want to add the suggestion to',
                required: true,
                choices: [
                    {
                        name: 'Stallion Squad',
                        value: 'stallion_squad',
                    },
                    {
                        name: 'Peekio Connect',
                        value: 'connect',
                    },
                    {
                        name: 'Discord',
                        value: 'discord',
                    },
            ],
            }, 
            {
                name: 'suggestion',
                type: 'STRING',
                description: 'Write your suggestion here',
                required: true,
            }],
    },
];