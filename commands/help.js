const { EmbedBuilder, Util, resolveColor, EmbedField } = require("discord.js");

let commandName = "help"

module.exports = {
    name: commandName,
    //aliases: ["h"],
    description: "Display all commands and descriptions",
    visible: true,
    enabled: true,
    execute(message) {
        let commands = message.client.commands;

        let helpEmbed = new EmbedBuilder()
            .setTitle(`List of all available commands`)
            .setColor(resolveColor("#15C2E3"));

        commands.forEach((cmd) => {
            if(cmd.visible === true && cmd.enabled === true) {
                helpEmbed.addFields({
                    name: `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${message.client.prefix}${cmd.aliases})` : ""}**`,
                    value: `${cmd.description}`,
                    inline: false
                });
            }
        });

        helpEmbed.setFooter({text: `Requested by ${message.author.username}#${message.author.discriminator}`});
        helpEmbed.setTimestamp();
        
        return message.channel.send({embeds: [helpEmbed]}).catch(console.error);
    }
};