const { EmbedBuilder, Util, resolveColor } = require("discord.js");

let commandName = "ping"

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Checks Horsebot's response time to Discord",
    visible: false,
    enabled: true,
    execute(message) {
        let outputMessage = new EmbedBuilder()
            .setColor(resolveColor(1426147))
            .setTitle("🏓 Pong!")
            .setDescription(`Latency is ${message.createdTimestamp - Date.now()*1000}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`)
        
        return message.channel.send({embeds: [outputMessage]}).catch(console.error);
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