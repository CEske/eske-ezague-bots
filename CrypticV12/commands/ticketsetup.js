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
    let channelid1 = message.channel.id
    let staffid = message.member.id  
    con.query(`SELECT * FROM staffs WHERE staffid = '${staffid}'`, (err1, row1) => {
        if(row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
            con.query(`SELECT * FROM ticketsystem`, (err2, row2) => {
                let beskedid = row2[0].beskedid
                let channelid = row2[0].channel
                bot.channels.cache.get(channelid).messages.delete(beskedid)
                message.delete()
                const ticketEmbed = {
                    color: 0x37ae5f,
                    author: {
                        name: 'Cryptic Ticket', 
                        icon_url: 'https://cdn.discordapp.com/attachments/787053886174134292/788085575701626880/cryptic.png'
                    },
                    description: 'Reager med 📩 for at åbne en ticket!'
                };
                message.channel.send({embed: ticketEmbed}).then((msg) => {
                    msg.react('📩')
                    con.query(`UPDATE ticketsystem SET channel = '${channelid1}', beskedid = '${msg.id}'`)
                })
            })
        } else {                    
            message.delete();
        }
    })
}

module.exports.help = {
  name: "ticketsetup"
}