const { EmbedBuilder, Util, resolveColor, EmbedField, ModalBuilder, ModalComponentBuilder, ModalActionRowComponent, ModalSubmitInteraction, TextInputBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

let commandName = "boohoo2"

module.exports = {
    name: commandName,
    description: "boo hoo",
    visible: false,
    enabled: true,
    async interaction(interaction) {
        //send a message with a value from text input from the interaction
        let outputMessage = new EmbedBuilder()
            .setColor(resolveColor(0x9500ff))
            .setTitle("Boo Hoo")
            .setDescription(`${interaction.fields.getTextInputValue("text_input")}`)
            .setAuthor({name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
        await interaction.reply({embeds: [outputMessage]});
    }
};