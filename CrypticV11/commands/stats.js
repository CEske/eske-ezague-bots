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
        if(row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
            fivem.query(`SELECT * FROM vrp_user_identities WHERE user_id = '${spillerid}'`, (err2, row2) => { // navn, cpr, telefon
                if(row2[0]) {
                    fivem.query(`SELECT * FROM vrp_users WHERE id = '${spillerid}'`, (err3, row3) => { // whitelist, ban, sidst set
                        if(row3[0]) {
                            fivem.query(`SELECT * FROM vrp_user_moneys WHERE user_id = '${spillerid}'`, (err4, row4) => { // penge, bank 
                                if(row4[0]) {
                                    if(row3[0].whitelisted == 0) {
                                        var whitelisted = "Nej"
                                    } else {
                                        var whitelisted = "Ja"
                                    }

                                    if(row3[0].banned == 0) {
                                        var banned = "Nej"
                                    } else {
                                        var banned = "Ja"
                                    }

                                    const statsEmbed = {
                                        color: 0x37ae5f,
                                        author: {
                                            name: message.author.username + '#' + message.author.discriminator + ' har vist stats på ID '+spillerid, 
                                            icon_url: message.author.avatarURL
                                        },
                                        fields: [
                                            {
                                                name: "Fulde navn",
                                                value: row2[0].firstname + " " + row2[0].name
                                            },
                                            {
                                                name: "Telefonnummer",
                                                value: row2[0].phone
                                            },
                                            {
                                                name: "CPR",
                                                value: row2[0].registration
                                            },
                                            {
                                                name: "Whitelist",
                                                value: whitelisted,
                                                inline: false
                                            },
                                            {
                                                name: "Banned",
                                                value: banned,
                                                inline: true
                                            },
                                            {
                                                name: "Bank",
                                                value: row4[0].bank
                                            },
                                            {
                                                name: "Pung",
                                                value: row4[0].wallet
                                            },
                                            {
                                                name: "Sidst set",
                                                value: row3[0].last_date
                                            }
                                        ]
                                    };
                                    message.delete()
                                    let msgChannel = bot.channels.find(`name`, "bot-logs")
                                    msgChannel.send({embed: statsEmbed})
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
  name: "stats"
}