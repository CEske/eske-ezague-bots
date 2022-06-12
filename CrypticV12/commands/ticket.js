const Discord = require("discord.js");
const mysql = require('mysql');
const sequelize = require('sequelize');
const config = require("../configs/database.json");
const con = mysql.createConnection({
  host     : config.cryptic.host,
  user     : config.cryptic.user,
  password : config.cryptic.pass,
  database : config.cryptic.db,
});


module.exports.run = async (bot, message, args) => {
    let spiller = message.mentions.users.first()
    let type = args[0]
    let staffid = message.member.id  
    if(spiller && type) {
        con.query(`SELECT * FROM staffs WHERE staffid = '${staffid}'`, (err1, row1) => {
            if(row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass' || row1[0] && row1[0].rangering === 'Staff') {
                con.query(`SELECT * FROM tickets WHERE channelid = '${message.channel.id}'`, (err2, row2) => {
                    if(row2[0]) {
                        if(type === 'tilføj') {
                            message.channel.createOverwrite(spiller.id,
                                {
                                    SEND_MESSAGES: true,
                                    VIEW_CHANNEL: true
                                },
                            )
                            message.delete()
                            message.channel.send('<@' + spiller + '> blev tilføjet.')
                        } else if (type === 'fjern') {
                            message.channel.createOverwrite(spiller.id,
                                {
                                    SEND_MESSAGES: false,
                                    VIEW_CHANNEL: false
                                },
                            )
                            message.channel.send('<@' + spiller + '> blev fjernet.')
                            message.delete()
                        } else {
                            message.delete()
                        }
                    }
                })
            } else {                    
                message.delete();
            }
        })
    } else if (type && type === 'luk') {
        con.query(`SELECT * FROM tickets WHERE channelid = '${message.channel.id}'`, (err2, row2) => {
            if(row2[0]) {
                let channelid = row2[0].channelid
                let spiller = row2[0].spillerid
                let channel = bot.channels.cache.get(channelid)
                let ticketChannel = bot.channels.cache.find(channel => channel.name === "ticket-logs")
                const ticketLog = {
                    color: 0x37ae5f,
                    author: {
                        name: message.author.username + '#' + message.author.discriminator + ' lukkede '+channel.name, 
                        icon_url: message.author.avatarURL()
                    },
                    description: '<@'+spiller+'> fik lukket en ticket'
                };
                ticketChannel.send({embed: ticketLog})
                con.query(`DELETE FROM tickets WHERE channelid = '${message.channel.id}'`)
                channel.delete()
            }
        })        
    } else {
        message.delete()
    }
}

module.exports.help = {
  name: "ticket"
}