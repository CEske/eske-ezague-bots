const Discord = require("discord.js");
const mysql = require('mysql');
const { json } = require("sequelize");
const sequelize = require('sequelize');
const config = require("../configs/database.json");

const con = mysql.createConnection({
  host     : config.cryptic.host,
  user     : config.cryptic.user,
  password : config.cryptic.pass,
  database : config.cryptic.db,
});
const vrp = mysql.createConnection({
  host     : config.fivem.host,
  user     : config.fivem.user,
  password : config.fivem.pass,
  database : config.fivem.db,
});

module.exports.run = async (bot, message, args) => {
  if(message.channel.id === '788012211683196939') {
    let staff = message.member.id
    let userid = args[0]
    let ranks = args[1]
    if(args[0]) {
      if(args[1]) {
        con.query(`SELECT * FROM staffs WHERE staffid = '${staff}'`, (err1, row1) => {
            if(row1[0] && row1[0].rangering === 'Staff' || row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
                vrp.query(`SELECT * FROM vrp_user_data WHERE user_id = '${userid}'`, (err2, row2, res2) => {
                    if(row2[0]) {
                        parsedData = JSON.parse(row2[0].dvalue)
                        Reflect.deleteProperty(parsedData.groups, [ranks])
                        var dvalue = JSON.stringify(parsedData)
                        vrp.query(`UPDATE vrp_user_data SET dvalue = '${dvalue}' WHERE user_id = '${userid}' AND dkey = 'vRP:datatable'`)
                        let banChannel = bot.channels.cache.find(channel => channel.name === "bot-logs")
                        const banEmbed = {
                            color: 0x37ae5f,
                            author: {
                                name: message.author.username + '#' + message.author.discriminator + ' har frataget ID '+userid+' en rank', 
                                icon_url: message.author.avatarURL()
                            },
                            description: '**ID:** '+userid+' har fået fjernet ranken '+ranks
                        };
                        message.delete()
                        banChannel.send({embed: banEmbed})
                    } else {
                        message.delete()
                    }
                })
            } else {
                message.delete()
            }
        })
      } else {
        message.delete()
      }
    } else {
      message.delete()
    }
  } else {
    message.delete()
  }
}

module.exports.help = {
  name: "fjernrank"
}