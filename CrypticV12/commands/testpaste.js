const Discord = require("discord.js");
const mysql = require('mysql');
const sequelize = require('sequelize');
const fs = require('fs');
const yaml = require('js-yaml');
const PastebinAPI = require('pastebin-js');
const databaser = require("../configs/database.json");
const pastebinJs = require("pastebin-js");
const con = mysql.createConnection({
  host     : databaser.cryptic.host,
  user     : databaser.cryptic.user,
  password : databaser.cryptic.pass,
  database : databaser.cryptic.db,
});

var pastebinKey = '1SMseNTuVSonvQOypiyvabFb3OxghEu2'
let pastebin = null
pastebin = new PastebinAPI(pastebinKey);

const fivem = mysql.createConnection({
    host     : databaser.fivem.host,
    user     : databaser.fivem.user,
    password : databaser.fivem.pass,
    database : databaser.fivem.db,
});

module.exports.run = async (bot, message, args) => {
  bot.channels.cache.get(message.channel.id).messages.fetch({ around: message.id, limit: 100 }).then(messages => {
    let text = "";

    for (let [key, value] of messages) {
      const date = new Date(value.createdTimestamp);
      let dateString = `${date.getDate()}/${date.getMonth()} ${date.getHours()}h ${date.getMinutes()}m`;

      text += `${value.author.tag} at ${dateString}: ${value.content}\n`;
    }

    pastebin.createPaste({
      text: text,
      title: "Transcript",
      format: null,
      privacy: 1
    }).then(data => {
      console.log(`Created paste: ${data}`);

      message.author.send(`Transcript: ${data}`)
          .then(() => console.log(`Sent user "${message.author.tag}" transcript.`))
          .catch((err) => {
              console.log(`Could not PM transcript, falling back to message in channel: ${err}`);
              message.reply(data).fail((err) => console.log(`Uh oh! Something went wrong: ${err}`));
          });
    })
  })
}

module.exports.help = {
  name: "testpaste"
}