const { MessageEmbed } = require("discord.js");

let commandName = "update"

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Updates development values values",
    visible: false,
    enabled: true,
    execute(message, args) {

        console.log(args);
        
        //Privileges check
        if(!message.client.devs.contains(message.author.id)) {
            let outputMessage = {
                embed: {
                    color: "ff7070".toString(10),
                    title: "Update Module",
                    description: `You do not have access to that command`
                }
            }

            return message.channel.send(outputMessage).catch(console.error);
        }
        
        if(args.length == 0) {return message.channel.send("Uh oh! You missed some arguments while trying to execute that command")}
        
        if(args[0] == "status") {
            if(args[1] == undefined) {return message.channel.send("Uh oh! You missed some arguments while trying to execute that command")}
            if(args[2] == undefined) {return message.channel.send("Uh oh! You missed some arguments while trying to execute that command")}
            
            if(args[1] == "type") {
                console.log(message.client.statusType)
                message.client.statusType = args[2]
                message.client.user.setActivity(`${message.client.statusText}`, {type: message.client.statusType})
            }
            if(args[1] == "text") {
                message.client.statusText = args[2]
                message.client.user.setActivity(`${args.slice(2).join(' ')}`, {type: message.client.statusType})
            }
            
            return message.reply("<a:horsespin:816327724175851621>");
        }

        return;
    }
};