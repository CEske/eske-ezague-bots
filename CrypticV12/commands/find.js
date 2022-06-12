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
    let fornavn = args[0]
    let efternavn = args.join(" ").slice(fornavn.length+1);
    if(fornavn && efternavn) {
      con.query(`SELECT * FROM staffs WHERE staffid = '${userid}'`, (err1, row1) => {
        if(row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
            fivem.query(`SELECT * FROM vrp_user_identities WHERE firstname = '${fornavn}' AND name LIKE '${efternavn}'`, (err2, row2) => {
                if(row2[0]) {
                    const whitelistEmbed = {
                        color: 0x37ae5f,
                        author: {
                            name: message.author.username + '#' + message.author.discriminator + ' har lige søgt på '+fornavn + ' ' + efternavn, 
                            icon_url: message.author.avatarURL()
                        },
                        description: '**ID:** '+row2[0].user_id+' er blevet fundet'
                    };
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
      })
    } else {
        message.delete()
    }
}

module.exports.help = {
  name: "find"
}