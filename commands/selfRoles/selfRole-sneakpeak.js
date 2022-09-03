const { MessageEmbed } = require("discord.js");

let commandName = "selfRole-sneakpeak"


module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Not available",
    visible: false,
    execute(reaction, user) {
        if(!reaction.message.guild.members.cache.get(user.id).roles.cache.has("859189756629876746")) {
            reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.get("859189756629876746"))
        } else {
            reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.get("859189756629876746"))
        }
        reaction.message.react("🔔");
        return;
    }
};