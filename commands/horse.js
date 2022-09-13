const { EmbedBuilder, AttachmentBuilder, Util, resolveColor } = require("discord.js");

let commandName = "horse"

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Sends random image from thishorsedoesnotexist.com",
    visible: true,
    enabled: true,
    async execute(message) {
        let attachment = new AttachmentBuilder();
        attachment.setName("horsedoesnotexist.png");
        attachment.setFile("https://thishorsedoesnotexist.com");
        return message.channel.send({content: "Here's your horse!", files: [attachment]}).catch(e => console.log(e));
    },

    async interaction(interaction) {
        let attachment = new AttachmentBuilder();
        attachment.setName("horsedoesnotexist.png");
        attachment.setFile("https://thishorsedoesnotexist.com");
        await interaction.reply({content: "Here's your horse!", files: [attachment]}).catch(e => console.log(e));
    }
};