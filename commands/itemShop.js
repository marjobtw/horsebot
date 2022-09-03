const { MessageEmbed, MessageAttachment } = require("discord.js");
const fetch = require("node-fetch");
const Canvas = require('canvas');
const path = require('path');
const sharp = require('sharp')
const axios =  require("axios");
let settings = { method: "Get" };

let commandName = "shop";

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Item shop",
    visible: false,
    enabled: true,
    async execute(message) {

        //Get shop data
        
        var shopData;
        
        //Fetch shop
        //await fetch(`http://api.peekio.no/item-shop.json`, settings).then(res => res.text()).then(json => shopData = JSON.parse(json));
        shopData = require('../json.json')

        //Start drawing
        const canvas = Canvas.createCanvas(1080, 608);
        Canvas.registerFont(path.join(process.cwd(), "/fonts/BurbankBigRegular-Black-2.otf"), {family: 'Burbank'})
        Canvas.registerFont(path.join(process.cwd(), "/fonts/BurbankSmall-Bold.otf"), {family: 'Burbank'})
        const ctx = canvas.getContext('2d');
        
        const background = await Canvas.loadImage(
            path.join(__dirname, '../images/item_shop/background.png')
        )
        await ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "rgba(0,0,0,0.5)"

        var text;
        var distance;
        
        //Top
        ctx.fillStyle = '#ffffff';
        ctx.font = '78px "Burbank Big Rg Bk"'
        ctx.textAlign = 'center';
        text = `THE shop`
        distance = ctx.measureText(text).width
        await ctx.fillText(text, 540, 75);
        
        //Featured
        ctx.fillStyle = '#ffffff';
        ctx.font = '36px "Burbank Big Rg Bk"'
        ctx.textAlign = 'center';
        text = `Feturend`
        distance = ctx.measureText(text).width
        await ctx.fillText(text, 240, 175);
        
        var item, rarity, maxWidth, minFontSize, fontSize, img;
        
        let image2, buffer2, imageBuffer2;
        
// Featured 1
        item = message.client.steamItems.find(o => o.itemdefid == shopData.featured[0].SteamID);
        rarity = item.tags.split(';')[0].split(':')[1];
        img = await Canvas.loadImage(
            path.join(__dirname, `../images/item_shop/feature_${rarity}.png`)
        )
        await ctx.drawImage(img, 70, 210, 160, 240);
        
        maxWidth = 150;
        minFontSize = 8;
        fontSize = 28;
        
            //Item name
        ctx.font = `${fontSize}px "Burbank Big Rg Bk"`
        ctx.textAlign = 'center';
        text =  item.name;
        distance = ctx.measureText(text).width
        getFontsize(maxWidth, fontSize, minFontSize, ctx, distance, text);
        
        await ctx.fillText(text, 150, 390);
        
            //Item Price
        ctx.font = `${fontSize}px "Burbank Big Rg Bk"`
        ctx.textAlign = 'center';
        text =  `Price: ${shopData.featured[0].CoinPrice}`;
        distance = ctx.measureText(text).width
        getFontsize(maxWidth-10, fontSize, minFontSize, ctx, distance, text);

        await ctx.fillText(text, 150, 430);
        
            //Item Image
        image2 = await axios.get(item.icon_url, {responseType: 'arraybuffer'}).catch(console.error);
        buffer2 = await Buffer.from(image2.data, "utf-8")
        imageBuffer2 = await sharp(buffer2).png().toBuffer()
        img = await Canvas.loadImage(imageBuffer2, ({format: 'png'}))
        await ctx.drawImage(img, 100, 240, 100, 100);

// Featured 2
        item = message.client.steamItems.find(o => o.itemdefid == shopData.featured[1].SteamID);
        rarity = item.tags.split(';')[0].split(':')[1];
        img = await Canvas.loadImage(
            path.join(__dirname, `../images/item_shop/feature_${rarity}.png`)
        )
        await ctx.drawImage(img, 250, 210, 160, 240);

        maxWidth = 150;
        minFontSize = 8;
        fontSize = 28;

        //Item name
        ctx.font = `${fontSize}px "Burbank Big Rg Bk"`
        ctx.textAlign = 'center';
        text =  item.name;
        distance = ctx.measureText(text).width
        getFontsize(maxWidth, fontSize, minFontSize, ctx, distance, text);

        await ctx.fillText(text, 330, 390);

        //Item Price
        ctx.font = `${fontSize}px "Burbank Big Rg Bk"`
        ctx.textAlign = 'center';
        text =  `Price: ${shopData.featured[1].CoinPrice}`;
        distance = ctx.measureText(text).width
        getFontsize(maxWidth-10, fontSize, minFontSize, ctx, distance, text);
        await ctx.fillText(text, 330, 430);

        //Item Image
        image2 = await axios.get(item.icon_url, {responseType: 'arraybuffer'}).catch(console.error);
        buffer2 = await Buffer.from(image2.data, "utf-8")
        imageBuffer2 = await sharp(buffer2).png().toBuffer()
        img = await Canvas.loadImage(imageBuffer2, ({format: 'png'}))
        await ctx.drawImage(img, 280, 240, 100, 100);
        
        let canvas_buffer = await canvas.toBuffer();
        
        const attachment = await new MessageAttachment(canvas_buffer, 'image.png');

        return message.channel.send({files: [attachment]});
    },

    async interaction(interaction) {
        await interaction.deferReply();

        await interaction.editReply({content: "d"});
    }
};

function getFontsize(maxWidth, fontSize, minFontSize, ctx, distance, text) {
    if (distance > maxWidth) {
        var newfontSize = fontSize;
        var decrement = 1;
        var newWidth;
        while (distance > maxWidth) {
            newfontSize -= decrement;
            if (newfontSize < minFontSize) {
                ctx.font = `${minFontSize}px "Burbank Big Rg Bk"`
                break;
            }
            ctx.font = `${newfontSize}px "Burbank Big Rg Bk"`;
            newWidth = ctx.measureText(text).width;
            if(newWidth < maxWidth && decrement === 1){
                decrement = 0.1;
                newfontSize += 1;
            } else {
                distance = newWidth;
            }
        }
        ctx.font = `${newfontSize}px "Burbank Big Rg Bk"`;
    }
}