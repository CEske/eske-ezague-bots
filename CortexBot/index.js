const Discord = require('discord.js');
const { Client, Intents, Collection } = require('discord.js');
var con = require('./backend/database');
const client = new Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'], partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] });
const config = require('./backend/config.json');
const fs = require('fs');
client.events = new Discord.Collection();
client.slashcommands = new Discord.Collection();
client.slashcommandData = [];

function readDir(dir) {
    let returnarray = [];

    function search(dir) {
        fs.readdirSync(dir).forEach(f => {
            if (fs.statSync(dir + "/" + f).isDirectory()) {
                search(dir + "/" + f)
            } else {
                returnarray.push(dir + "/" + f)
            }
        })
    }
    search(dir)
    return returnarray
}

const slashcommandFiles = readDir('./slashs').filter(file => !file.includes('template.js'));

for (const file of slashcommandFiles) {
    const slashcommand = require(`${file}`);
    client.slashcommandData.push(slashcommand.data.toJSON())
    client.slashcommands.set(slashcommand.data.name, slashcommand);
}

console.log('//////// Slash Commands ////////')
console.table(client.slashcommands);
console.log(`Loaded ${client.slashcommands.size} slash commands`);

const eventFiles = readDir('./events').filter(file => !file.includes('template.js'));

eventFiles.forEach(file => {
    const event = require(file);
    try {
        const options = {
            Discord,
            config,
            con,
            fs
        }
        client.on(event.eventName, (...args) => {
            event.run(client, options, ...args);
        });
    } catch (err) {
        console.log(err.stack);
    }
});

client.login(config.token);