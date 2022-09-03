const { EmbedBuilder, Util, resolveColor } = require("discord.js");
const fetch = require("node-fetch");

let commandName = "refresh-items"

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Refreshes steam item data",
    visible: false,
    enabled: true,
    async execute(message, args) {
        if(!enabled) return;
        //check if user has permissions to use the command
        if(!message.client.devs.contains(message.author.id)) {
            let outputMessage = new EmbedBuilder() 
                .setColor(resolveColor("ff7070".toString(10)))
                .setTitle("Access denied")
                .setDescription(`You do not have access to that command`);
            return message.channel.send(outputMessage).catch(console.error);
        }
        //fetch item definitions and replace the variable with it
        await fetch("http://api.peekio.no/GetItemDefs.php?format=json", {method: "Get"}).then(res => res.json()).then(json => message.client.steamItems = JSON.parse(json.response.itemdef_json));
        console.log(`Reloaded ${message.client.steamItems.length} steam items`)
        return message.react("816327724175851621").catch(e => console.log(e));
    },

    async interaction(interaction) {
        return;
    }
};