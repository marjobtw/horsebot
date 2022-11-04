const { EnumResolvers, EmbedBuilder, Util, ButtonBuilder, ButtonStyle, resolveColor, ActionRowBuilder} = require("discord.js");
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
            await fetch(`http://api.kozi.dev/items/${args[0]}`, settings)
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
            await fetch(`http://api.kozi.dev/items/${interaction.options._hoistedOptions[0].value}`, settings)
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
    const builder = new PagesBuilder(interaction);
    
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
        const ownershipBtn = new ButtonBuilder()
            .setLabel("🔎 View past owners")
            .setStyle(3);
        
        const viewInInventory = new ButtonBuilder()
            .setLabel("🌐 View on Steam")
            .setStyle(5);
        
        
        let page = () => {
            viewInInventory.setURL(`https://steamcommunity.com/profiles/${playerData.steamid}/inventory/#1391070_2_${element.itemid}`)
            ownershipBtn.setCustomId(element.originalitemid);
            builder.setComponents(new ActionRowBuilder().addComponents([viewInInventory, ownershipBtn]));

            return new EmbedBuilder()
                .setDescription(`**${item.name}**\n${desc}`)
                .setColor(resolveColor(item.name_color))
                .setThumbnail(`${item.icon_url_large}`)
                .addFields(
                    {name: "Quantity", value: `${element.quantity}`, inline: false},
                    {
                        name: "Acquired",
                        value: `${new Date(element.acquired.replace(/(....)(..)(.....)(..)(.*)/, '$1-$2-$3:$4:$5')).toISOString().split("T")[0]} ${new Date(element.acquired.replace(/(....)(..)(.....)(..)(.*)/, '$1-$2-$3:$4:$5')).toISOString().split("T")[1].split('.')[0]}`,
                        inline: true
                    },
                    {name: "Origin", value: origin, inline: true})
        }
        pages.push(page)
    });
    
    //Ownership buttons handler
    let triggers = [];
    await data.forEach(element => {triggers.push({name: element.originalitemid,
        async callback(interactionCallback, button) {
            button.setDisabled(true)
                .setLabel('🔎 View past owners');

            let reply = await getOwnerships(element.originalitemid);

            interaction.reply({embeds: [reply]});
        }})});
    
    await builder
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
        .setTriggers(triggers)
        .setListenEndColor(1426147)
        .setPaginationFormat(`Page: %c/%m`)
        .build();
}

async function getOwnerships(originalitemid) {
    //make an object with owner name and date of ownership
    let ownerships = [];
    let owners = await fetch(`http://api.kozi.dev/ownership/${originalitemid}`, settings).then(res => res.json());
    owners.forEach(owner => {
        ownerships.push({name: owner.owner, date: owner.acquired});
    });

    //fetch owner steam profile
    let steamids = [];
    let steamprofiles = [];
    ownerships.forEach(ownership => {
        steamids.push(ownership.name);
    });
    let steamidsstring = steamids.join(",");
    let steamprofilesjson = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamidsstring}`, settings).then(res => res.json());

    steamprofilesjson.response.players.forEach(profile => {
        steamprofiles.push(profile);
    });

    //add steam profile to ownerships
    ownerships.forEach(ownership => {
        steamprofiles.forEach(profile => {
            if (ownership.name == profile.steamid) {
                ownership.profile = profile;
            }
        });
    });


    //format owners as (owner > time between next date and this date > owner2)
    let ownersString = "";
    for(let i = 0; i < ownerships.length; i++) {
        if(i === ownerships.length - 1) {
            ownersString += `${ownerships[i].profile.personaname}`;
        }else{
            ownersString += `${ownerships[i].profile.personaname} > ${Math.round((new Date(convertDateToDate(ownerships[i+1].date)) - new Date(convertDateToDate(ownerships[i].date))) / (1000 * 60 * 60 * 24))} days > `;
        }
    }

    let ownersEmbed = new EmbedBuilder()
        .setTitle("Past owners")
        .setDescription(ownersString)
        .setColor(resolveColor("ff7070".toString(10)));
    return ownersEmbed;
}

function convertDateToDate(icsDate) {
    if (!/^[0-9]{8}T[0-9]{6}Z$/.test(icsDate))
        throw new Error("ICS Date is wrongly formatted: " + icsDate);

    var year   = icsDate.substr(0, 4);
    var month  = icsDate.substr(4, 2);
    var day    = icsDate.substr(6, 2);

    var hour   = icsDate.substr(9, 2);
    var minute = icsDate.substr(11, 2);
    var second = icsDate.substr(13, 2);

    return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}