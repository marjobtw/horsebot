const { EmbedBuilder, resolveColor } = require("discord.js");

const fetch = require('node-fetch');
let url = "https://stallionsquad.fandom.com/api.php?action=query&meta=siteinfo&siprop=statistics&format=json";
let settings = { method: "Get" };

let commandName = "wiki"

let lbData;

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Displays wiki statistics",
    visible: true,
    enabled: true,
    cooldown: 10,
    async execute(message) {
        let msg = await getWikiStats()
        return message.channel.send({embeds: [msg]}).catch(console.error);
    },
    
    async interaction(interaction){
        await interaction.deferReply();
        let msg = await getWikiStats()
        await interaction.editReply({embeds: [msg]});
    }
};

async function getWikiStats() {
    await fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            lbData = json;
        });

    let stats = lbData.query.statistics;

    outputMessage = new EmbedBuilder()
        .setColor(resolveColor(0xFA005A))
        .setTitle("Wiki statistics")
        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Fandom_heart-logo.svg/1473px-Fandom_heart-logo.svg.png")
        .setDescription(`**Articles:** ${stats.articles}\n**Edits:** ${stats.edits}\n**Pages:** ${stats.pages}\n**Images:** ${stats.images}`)
    
    return outputMessage;
}