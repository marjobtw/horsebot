const { MessageEmbed, MessageAttachment } = require("discord.js");
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
        Canvas.registerFont(path.join(process.cwd(), "/fonts/BurbankBigRegular-Black-2.otf"), {family: 'Burbank'})
        Canvas.registerFont(path.join(process.cwd(), "/fonts/BurbankSmall-Bold.otf"), {family: 'Burbank'})
        const ctx = canvas.getContext('2d');
        
        let url = message.user.displayAvatarURL();
        
        const response = await axios.get(url,  { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "utf-8")

        const output = await sharp(buffer).resize(256, 256).png().toBuffer();
        
        let buffered = output;
        
        var profilePicture = buffered;
        const pfp = await Canvas.loadImage(buffered, ({format: 'png'}))
        
        ctx.drawImage(pfp, 25, 20)
        
        // const pfp = await Canvas.loadImage(message.user.displayAvatarURL({format: 'png', size: 256}))
        // ctx.drawImage(pfp, 25, 20)
        
        const background = await Canvas.loadImage(
            path.join(__dirname, '../images/welcome_background.png')
        )
        ctx.drawImage(background, 0, 0);
        
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "rgba(0,0,0,0.5)"
        
        let texty = 125
        
        //Top
        ctx.fillStyle = '#ffffff';
        ctx.font = '50px "Burbank Big Rg Bk"'
        var text = `Welcome ${message.user.username}`
        var distance = ctx.measureText(text).width
        ctx.fillText(text, 300, texty)
        
        ctx.font = '36px "Burbank Small Bold"';
        let text2 =`#${message.user.discriminator}`
        ctx.fillText(text2, 300+distance+5, texty);
        
        //Bottom
        ctx.fillStyle = '#ffffff';
        ctx.font = '44px "Burbank Small Bold"'
        let bottomText = `You are our #${guild.memberCount} member`
        ctx.fillText(bottomText, 300, 185)
        
        const attachment = await new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
        
        return guild.channels.cache.get("596764237154484225").send({content:`Welcome <@${message.user.id}>!`, files: [attachment]}).catch(console.error);
    }
    
};
