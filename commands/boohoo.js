const { EmbedBuilder, Util, resolveColor, EmbedField, ModalBuilder, ModalComponentBuilder, ModalActionRowComponent, ModalSubmitInteraction, TextInputBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

let commandName = "boohoo"

module.exports = {
    name: commandName,
    description: "boo hoo",
    visible: false,
    enabled: true,
    execute(message) {
        if(!message.client.devs.contains(message.author.id)) {return}
        //delte the message
        message.delete().catch(console.error);
        //send a message with an action row containing a button that opens a modal
        let actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("boohoo")
                    .setLabel("Boo Hoo")
                    .setStyle(1)
            )
        // send the message
        return message.channel.send({content: "Boo Hoo", components: [actionRow]}).catch(console.error);
    },
    async interaction(interaction) {
        //create a modal
        let modal = new ModalBuilder()
            .setTitle("Boo Hoo")
            .setCustomId("boohoo2")
        
        //create a text input
        let textInput = new TextInputBuilder()
            .setCustomId("text_input")
            .setRequired(true)
            .setLabel("Boo Hoo")
            .setStyle(1)
        
        //add the text input to the modal
        const firstActionRow = new ActionRowBuilder().addComponents(textInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
    }
};