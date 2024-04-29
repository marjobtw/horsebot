const { MessageEmbed, AttachmentBuilder } = require("discord.js");
const Canvas = require('canvas');
const path = require('path');
const sharp = require('sharp')
const axios =  require("axios");

let commandName = "velkommen-member"

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Simulates welcome message",
    visible: false,
    enabled: false,
    async execute(message) {
        if(message.author != undefined) return;
        const {guild} = message;
        
        const canvas = Canvas.createCanvas(934, 282);
        // Canvas.registerFont(path.join(process.cwd(), "/fonts/BurbankBigRegular-Black-2.otf"), {family: 'Burbank'})
        // Canvas.registerFont(path.join(process.cwd(), "/fonts/BurbankSmall-Bold.otf"), {family: 'Burbank'})
        Canvas.registerFont(path.join(process.cwd(), "/fonts/Grandstander-Black.ttf"), {family: 'Grandstander'})
        Canvas.registerFont(path.join(process.cwd(), "/fonts/Rene_Bieder_-_RationalDisplayDEMO-SemiBold.otf"), {family: 'ReneBieder'})
        const ctx = canvas.getContext('2d');
        
        let url = message.user.displayAvatarURL();
        
        const response = await axios.get(url,  { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "utf-8")

        const output = await sharp(buffer).resize(248, 248).png().toBuffer();
        
        let buffered = output;
        
        var profilePicture = buffered;
        const pfp = await Canvas.loadImage(buffered, ({format: 'png'}))
        
        ctx.drawImage(pfp, 23, 17)
        
        // const pfp = await Canvas.loadImage(message.user.displayAvatarURL({format: 'png', size: 256}))
        // ctx.drawImage(pfp, 25, 20)
        
        const background = await Canvas.loadImage(
            path.join(__dirname, '../images/welcome_background2.png')
        )
        ctx.drawImage(background, 0, 0);
        
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "rgba(0,0,0,0.2)"
        
        let texty = 120
        
        //Top
        ctx.fillStyle = '#ffffff';
        ctx.font = '50px "Grandstander Black"'
        var text = `Welcome ${message.user.username}`
        var distance = ctx.measureText(text).width
        getFontsize(600, 50, 16, ctx, distance, text, "Grandstander Black")
        ctx.fillText(text, 300, texty)
        
        // ctx.font = '36px "Burbank Small Bold"';
        // let text2 =`#${message.user.discriminator}`
        // ctx.fillText(text2, 300+distance+5, texty);
        
        //Bottom
        ctx.fillStyle = '#ffffff';
        ctx.font = '44px "Rational Display DEMO SemiBold"'
        // let bottomText = `You are our #${guild.memberCount}th member!`
        let bottomText = `You are our #${ordinal_suffix_of(guild.memberCount)} member!`
        distance = ctx.measureText(bottomText).width
        getFontsize(600, 44, 16, ctx, distance, bottomText, "Rational Display DEMO SemiBold")
        ctx.fillText(bottomText, 300, texty+60)
        //ctx.fillText(bottomText, 300, 185)
        
        
        const attachment = await new AttachmentBuilder()
            .setName('profile-image.png')
            .setFile(canvas.toBuffer());
        
        
        
        return guild.channels.cache.get("596764237154484225").send({content:`Welcome <@${message.user.id}>!`, files: [attachment]}).catch(console.error);
    }
    
};

function getFontsize(maxWidth, fontSize, minFontSize, ctx, distance, text, font) {
    if (distance > maxWidth) {
        var newfontSize = fontSize;
        var decrement = 1;
        var newWidth;
        while (distance > maxWidth) {
            newfontSize -= decrement;
            if (newfontSize < minFontSize) {
                // ctx.font = `${minFontSize}px "Burbank Big Rg Bk"`
                ctx.font = `${minFontSize}px "${font}"`;
                break;
            }
            ctx.font = `${newfontSize}px "${font}"`;
            // ctx.font = `${newfontSize}px "Burbank Big Rg Bk"`;
            newWidth = ctx.measureText(text).width;
            if(newWidth < maxWidth && decrement === 1){
                decrement = 0.1;
                newfontSize += 1;
            } else {
                distance = newWidth;
            }
        }
        ctx.font = `${newfontSize}px "${font}"`;
        // ctx.font = `${newfontSize}px "Burbank Big Rg Bk"`;
    }
}

function ordinal_suffix_of(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}
