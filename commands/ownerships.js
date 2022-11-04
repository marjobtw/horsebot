const { EmbedBuilder, Util, resolveColor } = require("discord.js");

let commandName = "ownerships"

const fetch = require("node-fetch");
let settings = { method: "Get" };

module.exports = {
    name: commandName,
    ///aliases: [""],
    description: "Checks Horsebot's response time to Discord",
    visible: false,
    enabled: true,
    async execute(message, args) {

        let reply = await getOwnerships(args[0]);
        
        return message.channel.send({embeds: [reply]}).catch(console.error);
    },

    async interaction(interaction) {
        await interaction.deferReply();

        let outputMessage = new EmbedBuilder()
            .setColor(resolveColor(1426147))
            .setTitle("🏓 Pong!")
            .setDescription(`Latency is ${interaction.createdTimestamp - Date.now()*1000}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`)

        await interaction.editReply({embeds: [outputMessage]});
    }
};

async function getOwnerships(originalitemid) {
    //make an object with owner name and date of ownership
    let ownerships = [];
    let owners = await fetch(`http://api.kozi.dev/ownership/${originalitemid}`, settings).then(res => res.json());
    owners.forEach(owner => {
        ownerships.push({name: owner.owner, date: owner.acquired});
    });
    
    //fetch owner steam profile
    let steamids = [];
    let steamprofiles = [];
    ownerships.forEach(ownership => {
        steamids.push(ownership.name);
    });
    let steamidsstring = steamids.join(",");
    let steamprofilesjson = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamidsstring}`, settings).then(res => res.json());
    
    steamprofilesjson.response.players.forEach(profile => {
        steamprofiles.push(profile);
    });
    
    //add steam profile to ownerships
    ownerships.forEach(ownership => {
        steamprofiles.forEach(profile => {
            if (ownership.name == profile.steamid) {
                ownership.profile = profile;
            }
        });
    });
    
    
    //format owners as (owner > time between next date and this date > owner2)
    let ownersString = "";
    for(let i = 0; i < ownerships.length; i++) {
        if(i === ownerships.length - 1) {
            ownersString += `${ownerships[i].profile.personaname}`;
        }else{
            ownersString += `${ownerships[i].profile.personaname} > ${Math.round((new Date(convertDateToDate(ownerships[i+1].date)) - new Date(convertDateToDate(ownerships[i].date))) / (1000 * 60 * 60 * 24))} days > `;
        }
    }

    let ownersEmbed = new EmbedBuilder()
        .setTitle("Past owners")
        .setDescription(ownersString)
        .setColor(resolveColor("ff7070".toString(10)));
    return ownersEmbed;
}

function convertDateToDate(icsDate) {
    if (!/^[0-9]{8}T[0-9]{6}Z$/.test(icsDate))
        throw new Error("ICS Date is wrongly formatted: " + icsDate);

    var year   = icsDate.substr(0, 4);
    var month  = icsDate.substr(4, 2);
    var day    = icsDate.substr(6, 2);

    var hour   = icsDate.substr(9, 2);
    var minute = icsDate.substr(11, 2);
    var second = icsDate.substr(13, 2);

    return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}