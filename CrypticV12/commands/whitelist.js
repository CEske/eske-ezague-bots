const Discord = require("discord.js");
const mysql = require('mysql');
const sequelize = require('sequelize');
const databaser = require("../configs/database.json");
const con = mysql.createConnection({
  host     : databaser.cryptic.host,
  user     : databaser.cryptic.user,
  password : databaser.cryptic.pass,
  database : databaser.cryptic.db,
});

const fivem = mysql.createConnection({
    host     : databaser.fivem.host,
    user     : databaser.fivem.user,
    password : databaser.fivem.pass,
    database : databaser.fivem.db,
  });

module.exports.run = async (bot, message, args) => {
    let userid = message.member.id
    let spillerid = args[0]
    if(spillerid) {
      con.query(`SELECT * FROM staffs WHERE staffid = '${userid}'`, (err1, row1) => {
        if(row1[0] && row1[0].rangering === 'Staff' || row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass' || row1[0] && row1[0].rangering === 'WL') {
            const whitelistEmbed = {
                color: 0x37ae5f,
                author: {
                    name: message.author.username + '#' + message.author.discriminator + ' har lige whitelistet ID '+spillerid, 
                    icon_url: message.author.avatarURL
                },
                description: '**ID:** '+spillerid+' er nu whitelistet'
            };
            fivem.query(`SELECT * FROM vrp_users WHERE id = '${spillerid}'`, (err2, row2) => {
                if (row2[0]) {
                    fivem.query(`UPDATE vrp_users SET whitelisted = 1 WHERE id = '${spillerid}'`)
                }
            })
            message.delete()
            let msgChannel = bot.channels.cache.find(channel => channel.name === "bot-logs")
            msgChannel.send({embed: whitelistEmbed})
        } else {
          message.delete()
        }
      })
    } else {
      message.delete()
    }
}

module.exports.help = {
  name: "whitelist"
}