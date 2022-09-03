const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

let commandName = "gow9gh94gh982h89gh832h80g"

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "missing description",
    visible: false,
    enabled: true,
    async execute(reaction, reactor) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.log(error);
                return;
            }
        }
        const message = reaction.message;
        if (reaction.emoji.name !== '❔') return;
        if (reaction.count < 3) return;
        if (message.author.bot) return reactor.send(`${reactor} you can't ❔ my messages`);
        const starboardChannel = reaction.client.channels.cache.get("864993016796151818");

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Go to message')
                    .setStyle('LINK')
                    .setURL(message.url)
                    .setEmoji("🔗")
            );
        
        const fetch = await starboardChannel.messages.fetch({ limit: 100 });
        const stars = fetch.find(m => m.embeds[0].footer.text.startsWith('❔') && m.embeds[0].footer.text.endsWith(message.id));
        if (stars) {
            // Regex to check how many stars the embed has.
            const star = /^\❔\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
            // A variable that allows us to use the color of the pre-existing embed.
            const foundStar = stars.embeds[0];
            // We use the this.extension function to see if there is anything attached to the message.
            const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.first().url) : '';
            const embed = new MessageEmbed()
                .setColor(foundStar.color)
                .setDescription(foundStar.description)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setFooter(`❔ ${parseInt(star[1])+1} | ${message.id}`)
                .setImage(image);
            // We fetch the ID of the message already on the starboard.
            const starMsg = await starboardChannel.messages.fetch(stars.id);
            // And now we edit the message with the new embed!
            await starMsg.edit({embeds: [embed], components: [row] });
        }
        if (!stars) {
            // We use the this.extension function to see if there is anything attached to the message.
            const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.first().url) : '';
            // If the message is empty, we don't allow the user to star the message.
            if (image === '' && message.cleanContent.length < 1) return reactor.send(`${reactor}, you cannot star an empty message.`);
            const embed = new MessageEmbed()
                // We set the color to a nice yellow here.
                .setColor(13095127)
                // Here we use cleanContent, which replaces all mentions in the message with their
                // equivalent text. For example, an @everyone ping will just display as @everyone, without tagging you!
                // At the date of this edit (09/06/18) embeds do not mention yet.
                // But nothing is stopping Discord from enabling mentions from embeds in a future update.
                .setDescription(message.cleanContent)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp(new Date())
                .setFooter(`❔ 4 | ${message.id}`)
                .setImage(image);
            await starboardChannel.send({embeds: [embed], components: [row] });
        }
    },
    async removeReaction(reaction, user) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.log(error);
                return;
            }
        }
        const message = reaction.message;
        if (reaction.emoji.name !== '❔') return;
        const starboardChannel = reaction.client.channels.cache.get("864993016796151818");

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Go to message')
                    .setStyle('LINK')
                    .setURL(message.url)
                    .setEmoji("🔗")
            );
        
        const fetchedMessages = await starboardChannel.messages.fetch({ limit: 100 });
        const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('❔') && m.embeds[0].footer.text.endsWith(reaction.message.id));

        if (stars) {
            const star = /^\❔\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
            const foundStar = stars.embeds[0];
            const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.first().url) : '';
            const embed = new MessageEmbed()
                .setColor(foundStar.color)
                .setDescription(foundStar.description)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setFooter(`❔ ${parseInt(star[1])-1} | ${message.id}`)
                .setImage(image);
            const starMsg = await starboardChannel.messages.fetch(stars.id);
            await starMsg.edit({embeds: [embed], components: [row] });
            if(parseInt(star[1]) - 1 == 0) return starMsg.delete(1000);
        }
    },
    extension(reaction, attachment) {
        const imageLink = attachment.split('.');
        const typeOfImage = imageLink[imageLink.length - 1];
        const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
        if (!image) return '';
        return attachment;
    }
};