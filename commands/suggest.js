const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, EnumResolvers, resolveColor} = require("discord.js");

let commandName = "suggest"
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Adds a suggestion",
    visible: false,
    enabled: true,
    execute(message) {
        return;
    },

    async interaction(interaction2) {
        await interaction2.deferReply();
        interaction2.client.channels.fetch("595640218481328130").catch(e => console.log(e))
        let outputMessage;
        //Peekio Connect
        if(interaction2.options._hoistedOptions[0].value === "connect") {
            outputMessage = new EmbedBuilder()
                .setColor(resolveColor(7565784))
                .setTitle("Suggestion for Peekio Connect")
                .setDescription(`${interaction2.options._hoistedOptions[1].value}`)
                .setFooter({text: `Suggested by: ${interaction2.user.username}#${interaction2.user.discriminator}`, iconURL: interaction2.user.displayAvatarURL()})
                .setTimestamp(Date.now())
                .setThumbnail("https://kozi.dev/horsebot/connect.jpeg")
        }
        
        //Stallion Squad
        if(interaction2.options._hoistedOptions[0].value === "stallion_squad") {
            outputMessage = new EmbedBuilder()
                .setColor(resolveColor(46557))
                .setTitle("Suggestion for Stallion Squad")
                .setDescription(`${interaction2.options._hoistedOptions[1].value}`)
                .setFooter({text: `Suggested by: ${interaction2.user.username}#${interaction2.user.discriminator}`, iconURL: interaction2.user.displayAvatarURL()})
                .setTimestamp(Date.now())
                .setThumbnail("https://kozi.dev/horsebot/stallion_squad.jpeg")
        }

        //Discord
        if(interaction2.options._hoistedOptions[0].value === "discord") {
            outputMessage = new EmbedBuilder()
                .setColor(resolveColor(0xFFFFFE))
                .setTitle("Suggestion for Discord")
                .setDescription(`${interaction2.options._hoistedOptions[1].value}`)
                .setFooter({text:`Suggested by: ${interaction2.user.username}#${interaction2.user.discriminator}`, iconURL: interaction2.user.displayAvatarURL()})
                .setTimestamp(Date.now())
                .setThumbnail("https://kozi.dev/horsebot/discord.png")
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('Accept')
                    .setStyle(1),
                new ButtonBuilder()
                    .setCustomId('decline')
                    .setLabel("Decline")
                    .setStyle(4),
            );
        
        const reply = await interaction2.editReply({content: "Are you happy with this suggestion? (you have 15 seconds to decide)", embeds: [outputMessage], components: [row] });
        
        const filter = interaction3 => (interaction3.customID === 'accept' ||interaction3.customID ===  'decline') && interaction3.user.id === interaction2.user.id;
        const collector = reply.createMessageComponentCollector(filter, { time: 15000 });
        
        collector.on('collect', async interaction22 => {
            //Accept
            if(interaction22.customId === 'accept') {
                await interaction2.client.channels.cache.get("595640218481328130").send({embeds: [outputMessage]}).then(msg => msg.react('817840126671323196').then(msg.react('817840101710888970'))).catch(e => console.log(e))
                await interaction2.followUp({content: "Success!", ephemeral: true}).catch(e => console.log(e))
                await collector.stop();
            } 
            //Decline
            else if(interaction22.customId === 'decline') {
                await interaction2.followUp({content: "Operation declined.", ephemeral: true}).catch(e => console.log(e))
                await collector.stop();
            }
            return;
        });
        
        collector.on('end', async e => {
            await interaction2.deleteReply();
        })
    }
};