/*
outdated code
im not even gonna comment it
cuz it doesnt even use asynchronous functions
also leaderboard is currently unavailable in game so its also useless
 */
const { MessageEmbed } = require("discord.js");

const { countryCodeEmoji, emojiCountryCode } = require('country-code-emoji');

const fetch = require('node-fetch');
let url = "http://epicleaderboard.com/api/getScores.php?accessID=ad9dfa2f2ee66caa98f69f2d4ae855ce";
let settings = { method: "Get", headers: {'Accept': "application/vnd.epicleaderboard.v2+json", 'User-Agent': "X-UnrealEngine-EpicLeaderboard" }};

let commandName = "leaderboard"

let lbData;
let lbData2;

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Displays top 10 players",
    visible: true,
    enabled: false,
    cooldown: 10,
    execute(message) {
        
        let outputMessage;
        
        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                lbData2 = json;
                
                lbData = lbData2.scores;
                
                setTimeout(function() {        
                    outputMessage = {embed: {
                        color: 1426147,
                        title: `${lbData.length > 10 ? "Top 10 players" : `Top ${lbData.length} players`}`,
                        author: {
                             name: 'Stallion Squad Leaderboard'
                            },
                            description: `${lbData[0] ? `1. ${countryCodeEmoji(lbData[0].country)} **${lbData[0].username}** - ${lbData[0].score} <:horsecoin:786339065280200774>` : ""}
${lbData[1] ? `2. ${countryCodeEmoji(lbData[1].country)} **${lbData[1].username}** - ${lbData[1].score} <:horsecoin:786339065280200774>` : ""}
${lbData[2] ? `3. ${countryCodeEmoji(lbData[2].country)} **${lbData[2].username}** - ${lbData[2].score} <:horsecoin:786339065280200774>` : ""}
${lbData[3] ? `4. ${countryCodeEmoji(lbData[3].country)} **${lbData[3].username}** - ${lbData[3].score} <:horsecoin:786339065280200774>` : ""}
${lbData[4] ? `5. ${countryCodeEmoji(lbData[4].country)} **${lbData[4].username}** - ${lbData[4].score} <:horsecoin:786339065280200774>` : ""}
${lbData[5] ? `6. ${countryCodeEmoji(lbData[5].country)} **${lbData[5].username}** - ${lbData[5].score} <:horsecoin:786339065280200774>` : ""}
${lbData[6] ? `7. ${countryCodeEmoji(lbData[6].country)} **${lbData[6].username}** - ${lbData[6].score} <:horsecoin:786339065280200774>` : ""}
${lbData[7] ? `8. ${countryCodeEmoji(lbData[7].country)} **${lbData[7].username}** - ${lbData[7].score} <:horsecoin:786339065280200774>` : ""}
${lbData[8] ? `9. ${countryCodeEmoji(lbData[8].country)} **${lbData[8].username}** - ${lbData[8].score} <:horsecoin:786339065280200774>` : ""}
${lbData[9] ? `10. ${countryCodeEmoji(lbData[9].country)} **${lbData[9].username}** - ${lbData[9].score} <:horsecoin:786339065280200774>` : ""}`
                        }}

                    return message.channel.send({embeds: [outputMessage]}).catch(console.error);
                    
                }, 250)
                
            });
    }
};