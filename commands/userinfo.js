const { EmbedBuilder, resolveColor } = require("discord.js");
const moment = require("moment");

let commandName = "userinfo"

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Displays info about the user",
    visible: true,
    enabled: true,
    async execute(message, args) {
        let user, member;

        user = (message.mentions.users.first()) || message.author;
        member = message.mentions.members.first() || message.member;
        
        outputMessage = await getUserInfo(user, member);    
        return message.channel.send({embeds: [outputMessage]}).catch(console.error);
    },
    
    async interaction(interaction) {
        let user, member;
        await interaction.deferReply();
            if(interaction.options._hoistedOptions[0] != null) {
                interaction.guild.members.fetch(interaction.options._hoistedOptions[0].id)
                user = interaction.options._hoistedOptions[0].user;
                member = interaction.guild.members.cache.get(interaction.options._hoistedOptions[0].user.id);
            } else {
                user = interaction.user;
                member = interaction.member;
            }
            
            outputMessage = await getUserInfo(user, member)

        await interaction.editReply({embeds: [outputMessage]});
    }
};

async function getUserInfo(user, member) {
    return new EmbedBuilder()
        .setColor(resolveColor(1426147))
        .setThumbnail(user.displayAvatarURL())
        .setTitle(`Info about ${user.username}#${user.discriminator}`)
        .setDescription(`**User:** <@${user.id}>
**Account created:** ${moment.utc(user.createdAt).format('DD/MM/YYYY')}
**Joined server:** ${moment.utc(member.joinedAt).format('DD/MM/YYYY')}
**Roles:** ${member.roles.cache.map(roles => `${roles}`).slice(0, -1).join(', ')}`)
}