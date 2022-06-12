const Discord = require("discord.js");
const mysql = require('mysql');
const sequelize = require('sequelize');
const fs = require('fs').promises;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;
const PastebinAPI = require('pastebin-js');
const databaser = require("../configs/database.json");

const fivem = mysql.createConnection({
    host     : databaser.fivem.host,
    user     : databaser.fivem.user,
    password : databaser.fivem.pass,
    database : databaser.fivem.db,
});

module.exports.run = async (bot, message, args) => {
    let messageCollection = new Discord.Collection();
    let channelMessages = await bot.channels.cache.get(message.channel.id).messages.fetch({
        limit: 100
    }).catch(err => console.log(err));
    messageCollection = messageCollection.concat(channelMessages);

    let msgs = messageCollection.array().reverse();
    let data = await fs.readFile('./commands/template.html', 'utf8').catch(err => console.log(err));
    if(data) {
        await fs.writeFile('index.html', data).catch(err => console.log(err));
        let guildElement = document.createElement('div');
        let guildText = document.createTextNode(" "+message.channel.name);
        let guildImg = document.createElement('img');
        guildImg.setAttribute('src', message.guild.iconURL());
        guildImg.setAttribute('width', '150');
        guildElement.appendChild(guildImg);
        guildElement.appendChild(guildText);
        console.log(guildElement.outerHTML);
        await fs.appendFile('index.html', guildElement.outerHTML).catch(err => console.log(err));

        msgs.forEach(async msg => {
            let parentContainer = document.createElement("div");
            parentContainer.className = "parent-container";

            let avatarDiv = document.createElement("div");
            avatarDiv.className = "avatar-container";
            let img = document.createElement('img');
            img.setAttribute('src', msg.author.displayAvatarURL());
            img.className = "avatar";
            avatarDiv.appendChild(img);

            parentContainer.appendChild(avatarDiv);

            let messageContainer = document.createElement('div');
            messageContainer.className = "message-container";

            let nameElement = document.createElement("span");
            let name = document.createTextNode(msg.author.tag + " " + msg.createdAt.toDateString() + " " + msg.createdAt.toLocaleTimeString() + " EST");
            nameElement.appendChild(name);
            messageContainer.append(nameElement);

            if(msg.content.startsWith("```")) {
                let m = msg.content.replace(/```/g, "");
                let codeNode = document.createElement("code");
                let textNode =  document.createTextNode(m);
                codeNode.appendChild(textNode);
                messageContainer.appendChild(codeNode);
            }
            else {
                let msgNode = document.createElement('span');
                let textNode = document.createTextNode(msg.content);
                msgNode.append(textNode);
                messageContainer.appendChild(msgNode);
            }
            parentContainer.appendChild(messageContainer);
            await fs.appendFile('index.html', parentContainer.outerHTML)
            .catch(err => console.log(err));
        });
        message.author.send({
            files: ['./index.html']
        })
    }
}

module.exports.help = {
  name: "test"
}