const { MessageEmbed } = require("discord.js");

let commandName = "simulate-join"

Array.prototype.contains = function (needle) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Simulates join",
    visible: false,
    enabled: true,
    execute(message) {
        if(!message.client.devs.contains(message.author.id)) {return}
        //runs a new member command
        const command =
            message.client.commands.get("velkommen-member") ||
            message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes("velkommen-member"));
        command.execute(message.guild.members.cache.get(message.author.id));
    }
};