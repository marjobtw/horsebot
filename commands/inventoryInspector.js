const { EnumResolvers, EmbedBuilder, Util, ButtonBuilder, ButtonStyle, resolveColor} = require("discord.js");
const { PagesBuilder, PagesManager } = require('discord.js-pages');
var stringSimilarity = require("string-similarity");
let commandName = "inspect"
const pagesManager = new PagesManager();
const fetch = require("node-fetch");
let settings = { method: "Get" };
require('dotenv').config()

module.exports = {
    name: commandName,
    description: "Inspects given SteamID's inventory",
    visible: true,
    enabled: true,
    cooldown: 5,
    async execute(message, args) {
        if(message.client.steamItems == null) {
            return message.channel.send({embeds: [new EmbedBuilder().setDescription("There was an error while trying to fetch Steam items.\nThis is a possible API error and retrying won't work!\nPlease try again later.").setColor(resolveColor("ff7070".toString(10)))]})
        }
        pagesManager.middleware(message);
        if(args.length === 0) return;
        let data, playerData;

        try{
            //Fetch player inventory
            await fetch(`http://api.peekio.no/GetInventory.php?format=json&steamid=${args[0]}`, settings).then(res => res.json()).then(json => data = JSON.parse(json.response.item_json));
        }catch(e) {
            return message.channel.send({embeds: [new EmbedBuilder().setDescription("Inventory with this **SteamID64** is either empty or unavailable").setColor(resolveColor("ff7070".toString(10)))]});
        }
        //Fetch player data
        await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${args[0]}`, settings).then(res => res.json()).then(json => playerData = json.response.players[0]);
        await InventoryInspect(args, message, data, playerData).catch(e => console.log(e));
    },
    async interaction(interaction) {
        if(interaction.client.steamItems == null) {
            return await interaction.editReply({embeds: [new EmbedBuilder().setDescription("There was an error while trying to fetch Steam items.\nThis is a possible API error and retrying won't work!\nPlease try again later.").setColor("ff7070".toString(10))]})
        }
        pagesManager.middleware(interaction);
        await interaction.deferReply();
        let data, playerData;
        try{
            //Fetch player inventory
            await fetch(`http://api.peekio.no/GetInventory.php?format=json&steamid=${interaction.options._hoistedOptions[0].value}`, settings).then(res => res.json()).then(json => data = JSON.parse(json.response.item_json));
        }catch(e){
            return interaction.editReply({embeds: [new EmbedBuilder().setDescription("Inventory with this **SteamID64** is either empty or unavailable").setColor(resolveColor("ff7070".toString(10)))]});
        }
        //Fetch player data
        await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${interaction.options._hoistedOptions[0].value}`, settings).then(res => res.json()).then(json => playerData = json.response.players[0]);
        await InventoryInspect(interaction.options._hoistedOptions[0].value, interaction, data, playerData).catch(e => console.log(e));
    }
};

/**
 * @param {string}                 args                 SteamID64 of the requested user
 * @param {Interaction || Message} interaction          Interaction/Message associated with this instance
 * @param {JSON}                   data                 Steam Inventory JSON object of given SteamID64
 * @param {JSON}                   playerData           Player summary of given SteamID64
 **/
async function InventoryInspect(args, interaction, data, playerData) {
    let pages = [];
    await data.forEach(element => {
        let item = interaction.client.steamItems.find(o => o.itemdefid == element.itemdefid)
        let desc = item.description.replace("Rarity: ", "**Rarity**: ").replace(new RegExp("\\[color=.......]"), "").replace("[/color]", "").replace("[/color]", "").replace("[b]", "").replace("[/b]", "").replace("[i]", "").replace("[/i]", "")
        let origin;
        switch (element.origin) {
            case "external": origin = "External"
                break
            case "exchange": origin = "Item Shop/Crafting"
                break
            case "support": origin = "Support"
                break
            case "promo": origin = "Promotional"
                break
            case "sandboxpurchase": origin = "Test Purchase"
                break
            case "trade": origin = "Trade"
                break
			case "purchase": origin = "In-App Purchase"
                break
            case "market": origin = "Marketplace"
                break
            default: origin = "Not specified"
        }
        
        let page = new EmbedBuilder()
            .setDescription(`**${item.name}**\n${desc}`)
            .setColor(resolveColor(item.name_color))
            .setThumbnail(`${item.icon_url_large}`)
            .addFields(
                {name: "Quantity", value: `${element.quantity}`, inline: false},
                {name: "Acquired", value: `${new Date(element.acquired.replace(/(....)(..)(.....)(..)(.*)/, '$1-$2-$3:$4:$5')).toISOString().split("T")[0]} ${new Date(element.acquired.replace(/(....)(..)(.....)(..)(.*)/, '$1-$2-$3:$4:$5')).toISOString().split("T")[1].split('.')[0]}`, inline: true},
                {name: "Origin", value: origin, inline: true})
        pages.push(page)
    });
    
    await new PagesBuilder(interaction)
        .setTitle(`${playerData.personaname}'s inventory`)
        .setPages(pages)
        .setDefaultButtons([
            {first: new ButtonBuilder()
                    .setLabel('\u200b')
                    .setEmoji({id: '902669881386881044'})
                    .setStyle(2)
            },
            {back: new ButtonBuilder()
                    .setLabel('◀')
                    .setStyle(1)
            },
            {next: new ButtonBuilder()
                    .setLabel('▶')
                    .setStyle(1)
            },
            {last: new ButtonBuilder()
                    .setLabel('\u200b')
                    .setEmoji({id: '902669881424629801'})
                    .setStyle(2)
            },
            {stop: new ButtonBuilder()
                    .setLabel('\u200b')
                    .setEmoji({id: '902671500753113138'})
                    .setStyle(4)
            }]
        )
        .setListenEndColor(1426147)
        .setPaginationFormat(`Page: %c/%m`)
        .build();
}