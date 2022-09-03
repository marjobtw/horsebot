const { EmbedBuilder, Util, resolveColor, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");
const Canvas = require('canvas');
const path = require('path');
const sharp = require('sharp')
const axios =  require("axios");
require('dotenv').config()

const { countryCodeEmoji, emojiCountryCode } = require('country-code-emoji');
const { getCode, getName } = require('country-list');

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let url = "http://api.peekio.no/GetItemDefs.php?format=json";
let settings = { method: "Get" };
let data;
let playerData;

let commandName = "inventory"

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Refreshes steam item data",
    cooldown: 5,
    enabled: true,
    visible: false,
    async execute(message, args) {
        if(message.client.steamItems == null) {
            return message.channel.send({embeds: [new EmbedBuilder().setDescription("There was an error while trying to fetch Steam items.\nThis is a possible API error and retrying won't work!\nPlease try again later.").setColor(resolveColor("ff7070".toString(10)))]})
        }
        if(args[0] === undefined) return message.channel.send({embeds: [new EmbedBuilder().setDescription("You need to specify a valid **SteamID64**").setColor(resolveColor("ff7070".toString(10)))]});

        try{
            //Fetch player inventory
            await fetch(`http://api.peekio.no/GetInventory.php?format=json&steamid=${args[0]}`, settings).then(res => res.json()).then(json => data = JSON.parse(json.response.item_json));
        }catch(e) {
            return message.channel.send({embeds: [new EmbedBuilder().setDescription("Inventory with this **SteamID64** is either empty or unavailable").setColor(resolveColor("ff7070".toString(10)))]});
        }
        //Fetch player data
        await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${args[0]}`, settings).then(res => res.json()).then(json => playerData = json.response.players[0]);

        if(data.length === 0){
            return message.channel.send({embeds: [new EmbedBuilder().setDescription("Inventory with this **SteamID64** is either empty or unavailable").setColor(resolveColor("ff7070".toString(10)))]});
        }

        let [embed, attachment] = await drawInventory(message.client).catch(console.error);
        return message.channel.send({embeds: [embed], files: [attachment]});
    },

    async interaction(interaction) {
        if(interaction.client.steamItems == null) {
            return await interaction.reply({embeds: [new EmbedBuilder().setDescription("There was an error while trying to fetch Steam items.\nThis is a possible API error and retrying won't fix it!\nPlease try again later.").setColor(resolveColor("ff7070".toString(10)))]})
        }
        var args = [];
        await interaction.deferReply();
        args[0] = await interaction.options._hoistedOptions[0].value.toString();
        if(args[0] === undefined) return interaction.editReply({embeds: [new EmbedBuilder().setDescription("You need to specify a valid **SteamID64**").setColor(resolveColor("ff7070".toString(10)))]});
		var continueScript = true;

        try{
            //Fetch player inventory
            await fetch(`http://api.peekio.no/GetInventory.php?format=json&steamid=${interaction.options._hoistedOptions[0].value}`, settings).then(res => res.json()).then(json => data = JSON.parse(json.response.item_json));
        }catch(e){
            return interaction.editReply({embeds: [new EmbedBuilder().setDescription("Inventory with this **SteamID64** is either empty or unavailable").setColor(resolveColor("ff7070".toString(10)))]});
        }
        
        if(!continueScript) return;

        //Fetch player data
        await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${args[0]}`, settings).then(res => res.json()).then(json => playerData = json.response.players[0]);

        if(data.length === 0){
            return interaction.editReply({embeds: [new EmbedBuilder().setDescription("Inventory with this **SteamID64** is either empty or unavailable").setColor(resolveColor("ff7070".toString(10)))]});
        }
        
        let [embed, attachment] = await drawInventory(interaction.client);
        return interaction.editReply({embeds: [embed], files: [attachment]});
    }
};

async function drawInventory(client) {
    var t0 = performance.now();
    var execution_time = Date.now();

    var images = {key: function(n) {return this[Object.keys(this)[n]];}};
    let count = {key: function(n) {return this[Object.keys(this)[n]];}};
    var img = {key: function(n) {return this[Object.keys(this)[n]];}};

    await data.forEach(async function(item) {
        images[item.itemdefid] = await client.steamItems.find(o => o.itemdefid == item.itemdefid).icon_url_large;
        if (!count[item.itemdefid])
            count[item.itemdefid] = 0;

        count[item.itemdefid]++;

        if(item.itemdefid === "1") {
            count[item.itemdefid] = item.quantity;
        }
    })

    const canvas = Canvas.createCanvas(501, ((Math.ceil(Object.keys(images).length/10)*10)*100)/5+1);
    Canvas.registerFont(path.join(process.cwd(), "/fonts/BurbankBigRegular-Black-2.otf"), {family: 'Burbank'})
    Canvas.registerFont(path.join(process.cwd(), "/fonts/BurbankSmall-Bold.otf"), {family: 'Burbank'})
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(
        path.join(__dirname, '../images/inventory_background.png')
    )
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;

    //draw images
    const p = ctx.lineWidth / 2; //padding
    var index=0;

    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0,0,0,0.5)"

    for (let yCell = 0; yCell < (Object.keys(images).length-1)/5; yCell++) {
        for (let xCell = 0; xCell < 5; xCell++) {
            if(index > Object.keys(images).length) continue;
            if(typeof images.key(index) === 'function') continue;
            const x = xCell * 100;
            const y = yCell * 100;
            if(images.key(index) != undefined) {
                let image2 = await axios.get(images.key(index), {responseType: 'arraybuffer'}).catch(console.error);
                let buffer2 = await Buffer.from(image2.data, "utf-8")
                let imageBuffer2 = await sharp(buffer2).png().toBuffer()
                var img = await Canvas.loadImage(imageBuffer2, ({format: 'png'}))
                await ctx.drawImage(img, x+p, y+p, 100-p*2, 100-p*2);
            }

            if(count.key(index) > 1){
                ctx.fillStyle = '#ffffff';
                if(count.key(index).toLocaleString(undefined).length < 6) {
                    ctx.font = '32px "Burbank Small Bold"'
                } else {
                    ctx.font = '24px "Burbank Small Bold"'
                }
                let bottomText = `${count.key(index).toLocaleString(undefined)}`
                //ctx.fillText(bottomText, x+p, y+p)
                ctx.fillText(bottomText, 2.5+x+p*2, 85+y+p*2)
            }

            index++
        }
    }

    //draw grid
    for (let i = 0; i <= clamp((Object.keys(images).length-1), 5, Infinity); i++) {
        const x = i*100;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        const y = i*100;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    const attachment = await new AttachmentBuilder()
        .setFile(await canvas.toBuffer())
        .setName("inventory.png");

    var t1 = performance.now();

    const embed = new EmbedBuilder()
        .setTitle(`${playerData.personaname}'s inventory`)
        .setDescription(`${playerData.loccountrycode ? `${countryCodeEmoji(playerData.loccountrycode)} ${getName(playerData.loccountrycode)}\n\n` : ""}**${playerData.personaname}**'s Stallion Squad inventory contains **${data.length}** items. `)
        .setURL(playerData.profileurl)
        .setImage(`attachment://${attachment.name}`)
        .setThumbnail(playerData.avatarfull)
        .setColor(resolveColor(1426147))
        .setFooter({text: `SteamID: ${playerData.steamid} • Render time: ${((t1-t0)/1000).toFixed(2)}s`})
        .setTimestamp(execution_time);

    return [embed, attachment];
}