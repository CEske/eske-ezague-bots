const Discord = require('discord.js');
const { Client, Intents, Collection } = require('discord.js');
const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'], partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER']
});
const con = require('./backend/database');
const config = require('./backend/config.json');
const fs = require('fs');
const { readDir } = require('./functions/fileReader.js');
client.events = new Collection();
client.slashcommands = new Collection();
client.slashcommandData = [];
const debugMode = true;

const slashcommandFiles = readDir('./commands').filter(file => !file.includes('template.js'));

for (const file of slashcommandFiles) {
    const slashcommand = require(`${file}`);
    client.slashcommandData.push(slashcommand.data.toJSON())
    client.slashcommands.set(slashcommand.data.name, slashcommand);
}

const eventFiles = readDir('./events').filter(file => !file.includes('template.js'));

eventFiles.forEach(file => {
    const event = require(file);
    try {
        const options = { Discord, config, con, debugMode, fs };
        client.on(event.eventName, (...args) => {
            event.run(client, options, ...args);
        });
    } catch (err) {
        console.log(err.stack);
    }
});

client.login(config.token);
