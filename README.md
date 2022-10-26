<img src="https://cdn.discordapp.com/attachments/860582808790630431/1034923693438144563/HorsebotLogo.png" alt="Horsebot logo" title="Horsebot" align="right" height="60" />

<h1><b>Horsebot</b></h1>

Horsebot is the official Stallion Squad <a href="https://discord.gg/JYmVCVmSR7">Discord</a> Bot. It serves as a companion for players! Horsebot can retrieve players Steam inventories, item information and wiki data on the fly! Horsebot grabs API data from the <a href="https://www.peekio.no/api">Peekio API</a>.
    
:star: Star us on GitHub — it motivates us a lot!

## Table of Content

- [Installation](#installation)
    - [Creating environment variables](#creating-environment-variables)
    - [Composer](#composer)
- [TYPO3 setup](#typo3-setup)
    - [Extension](#extension)
    - [Database](#database)
- [Page setup](#page-setup)
    - [Upload the page tree file](#upload-the-page-tree-file)
    - [Go to the import view](#go-to-the-import-view)
    - [Import the page tree](#import-the-page-tree)
    - [SEO-friendly URLs](#seo-friendly-urls)
- [License](#license)
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
