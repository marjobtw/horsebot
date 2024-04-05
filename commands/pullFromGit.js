const { EmbedBuilder, Util, resolveColor } = require("discord.js");

let commandName = "restart"

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Checks Horsebot's response time to Discord",
    visible: false,
    enabled: true,
    async execute(message) {
        if(!message.client.devs.contains(message.author.id)) {
            let outputMessage = new EmbedBuilder()
                .setColor(resolveColor("ff7070".toString(10)))
                .setTitle("🔁 Not allowed...")
                .setDescription("What you trynna do brah")
            return message.channel.send({embeds: [outputMessage]}).catch(console.error);
        }
        
        if(message.client.restarting === false) {

            await rewriteFiles();
            console.log('Files rewritten successfully.');
            restartScript(module.parent.filename);

            return message.channel.send({content: "yay"}).catch(console.error).then(() => {
                process.exit(0)
            });
        } else {
            return;
        }
    },

    async interaction(interaction) {
        await interaction.deferReply();

        let outputMessage = new EmbedBuilder()
            .setColor(resolveColor(1426147))
            .setTitle("🏓 Pong!")
            .setDescription(`Latency is ${interaction.createdTimestamp - Date.now()*1000}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`)

        await interaction.editReply({embeds: [outputMessage]});
    }
};


const { spawn } = require('child_process');
const path = require('path');
const simpleGit = require('simple-git');

const repoPath = path.resolve(__dirname);

const repoUrl = 'https://github.com/marjobtw/horsebot.git';

const git = simpleGit();

async function rewriteFiles() {
    console.log('Pulling changes from the repository...');

    git.addRemote('origin', repoUrl);

    git.reset('hard', (err) => {
        if (err) {
            console.error('Error occurred while resetting the repository:', err);
            return;
        }
    }, 'main');

    await git.pull('origin', 'main', (err, update) => {
        if (err) {
            console.error('Error occurred while pulling changes:', err);
            return;
        }

        if (update && update.summary.changes) {
            console.log('Repository updated with the recent changes.');
            console.log('Summary:', update.summary);
        } else {
            console.log('No updates found.');
        }
    });

}

function restartScript(module) {
    const nodeExecutable = process.argv[0];
    
    console.log('Restarting script...');
    const newProcess = spawn(nodeExecutable, [module], {
        stdio: 'inherit', 
        detached: true,
        shell: true
    });
    
    newProcess.on('error', (err) => {
        console.error('Failed to spawn new process:', err);
    });
    
    newProcess.on('spawn', () => {
        process.exit(0);
    });
}