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
    let staffid = message.member.id
    if(spiller) {
        con.query(`SELECT * FROM staffs WHERE staffid = '${staffid}'`, (err1, row1) => {
            if(row1[0] && row1[0].rangering === 'Staff' || row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
                con.query(`SELECT * FROM mute WHERE spillerid = '${spiller.id}'`, (err2, row2) => {
                    if (row2[0]) {
                        const unmuteEmbed = {
                            color: 0x37ae5f,
                            author: {
                                name: spiller.username + '#' + spiller.discriminator + ' er blevet unmuted', 
                                icon_url: spiller.avatarURL
                            },
                            description: '<@'+spiller.id+'>, du kan nu skrive igen'
                        };
                        message.delete()
                        message.channel.send({embed: unmuteEmbed})
                        con.query(`DELETE FROM mute WHERE spillerid = '${spiller.id}'`)
                    } else {
                        message.delete()
                    }
                })
            } else {                    
                message.delete();
            }
        })
    } else {
        message.delete();
    }
}

module.exports.help = {
  name: "unmute"
}