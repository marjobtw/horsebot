<img src="https://cdn.discordapp.com/attachments/860582808790630431/1034923693438144563/HorsebotLogo.png" alt="Horsebot logo" title="Horsebot" align="right" height="60" />

<h1><b>Horsebot</b></h1>

Horsebot is the official Stallion Squad <a href="https://discord.gg/JYmVCVmSR7">Discord</a> Bot. It serves as a companion for players! Horsebot can retrieve players Steam inventories, item information and wiki data on the fly! Horsebot grabs API data from the <a href="https://www.peekio.no/api">Peekio API</a>.

Horsebot was originally created for the Steam game <a href="https://store.steampowered.com/app/1391070/Stallion_Squad">Stallion Squad</a> but we're now open-sourcing the project!
    
:star: Star us on GitHub — it motivates us a lot!

<img src="https://cdn.discordapp.com/attachments/860582808790630431/1034929371670122526/HorsebotShow.png" alt="Image of /inventory command in action" />

## Table of Content

- [Installation](#installation)
    - [Creating environment variables](#creating-environment-variables)
- [Commands](#commands)
- [Links](#links)
  
## Installation
<ol>
  <li>Extract files into a folder</li>
  <li>Open a terminal in your folder and install dependencies by using</li>
  
  `npm i`
  <li>To start use</li>
  
  `node index.js`
</ol>

### Creating environment variables
<ol>
  <li>Create .env file in your folder</li>
  <li>Define enviromental variables like that:</li>

```
BOT_TOKEN=YOUR_BOT_TOKEN
STEAM_API_KEY=YOUR_STEAM_API_KEY
```
  
   </ol>
   
## Commands

- <b>/horse</b> - Sends random image from thishorsedoesnotexist.com
- <b>/inspect</b> - Inspects user's Steam inventory using SteamId64
- <b>/inventory</b> - Displays user's Steam inventory using SteamId64
- <b>/item</b> Displays information about the Steam item
- <b>/ping</b> - Checks Horsebot's response time to Discord
- <b>/suggest</b> - Add a suggestion to the suggestions channel
- <b>/userinfo</b> - Displays information about the user
- <b>/wiki</b> - Displays wiki statistics

<center>
<img src="https://cdn.discordapp.com/attachments/860582808790630431/1034931233131610142/Credits.png" alt="Horsebot - a collaboration between KoziDev and Peekio" height="60" />
</center>
