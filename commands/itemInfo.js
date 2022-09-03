const { EmbedBuilder, Util, resolveColor } = require("discord.js");
var stringSimilarity = require("string-similarity");
let commandName = "item"

module.exports = {
    name: commandName,
    description: "Displays information about the Steam item",
    visible: true,
    enabled: true,
    async execute(message, args) {
        if(args.length === 0) return;
        args = args.join(' ');
        let content = await ItemData(args, true, message.author, message.client)
        message.channel.send(content)
    },
    async interaction(interaction) {
        await interaction.deferReply();
        let content = await ItemData(interaction.options._hoistedOptions[0].value, (interaction.options._hoistedOptions[1] != null) ? interaction.options._hoistedOptions[1].value : false, interaction.user, interaction.client);
        await interaction.editReply(content);
    }
};

/**
 * @param {string}  args                 Arguments passed from the message (item name/id)
 * @param {boolean} advancedStats        Display advanced stats
 * @param {User}    author               Sender of the message or interaction
 * @param {Client}  client               Client associated with this instance
 * */
async function ItemData(args, advancedStats = false, author, client) {
    //throw an error if the item definition is not available
    if(client.steamItems == null) {
        return {embeds: [new EmbedBuilder().setDescription("There was an error while trying to fetch Steam items.\nThis is a possible API error and retrying won't work!\nPlease try again later.").setColor(resolveColor("ff7070".toString(10)))]}
    }
    
    let embed, requestedItem;
    let itemArray = [];

    await client.steamItems.forEach(function(items) {
        itemArray.push(items.name);
    })

    //Find an item that matches the best
    requestedItem = await stringSimilarity.findBestMatch(args, itemArray).bestMatch;
    console.log(`[ItemInformation] ${author.username}#${author.discriminator}: "${args}" => "${requestedItem.target}" (Probability: ${(requestedItem.rating*100).toFixed(2)}%)`)

    //If it doesn't match the threshold, set it to that keyborard slam
    if(requestedItem.rating < 0.05) requestedItem.target = "ghejwhgiuwehugfweuhghuweghweughdsuighidfghihdsiguhreg";

    let item = await client.steamItems.find(i => i.name === requestedItem.target || i.itemdefid === args)

    if(item === undefined){
        return {embeds: [new EmbedBuilder().setDescription(`Item with that id/name does not exist.`).setColor(resolveColor("ff7070".toString(10)))]}
    }

    //Description formatting
    let desc = item.description.replace("Rarity: ", "**Rarity**: ").replace(new RegExp("\\[color=.......]"), "").replace("[/color]", "").replace("[/color]", "").replace("[b]", "").replace("[/b]", "").replace("[i]", "").replace("[/i]", "")
    
    let fields = []
    //Push item information into the embed fields
    fields.push({name: "Tradable", value: `${item.tradable}`, inline: true})
    fields.push({name: '\u200b', value: '\u200b', inline: true})
    fields.push({name: "Marketable", value: `${item.marketable}`,inline: true})
    
    if(advancedStats) {
        fields.push({name:"Tags", value:(item.tags == undefined ? "none" : `${item.tags.replace(";", "\n")}`),inline: true})
        fields.push({name:'\u200b',value: '\u200b', inline: true})
        fields.push({name:"Type",value: (item.store_tags == undefined ? "none" : `${item.store_tags}`), inline: true})
        fields.push({name:"Slot",value: (item.display_type == "" ? "none" : `${item.display_type}`), inline: true})
        fields.push({name:'\u200b',value: '\u200b', inline: true})
        fields.push({name:"Last modified",value: `${new Date(item.Timestamp).toISOString().split("T")[0]} ${new Date(item.Timestamp).toISOString().split("T")[1].split('.')[0]}`, inline: true})
    }
    
    embed = new EmbedBuilder()
        .setTitle(advancedStats ? `${item.name} (${item.itemdefid})` : `${item.name}`)
        .setThumbnail(item.icon_url_large)
        .setColor(resolveColor(item.name_color))
        .setDescription(`${desc}`)
        .addFields(fields)
        
    return {embeds: [embed]};
}