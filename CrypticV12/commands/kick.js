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
    let bbanuser = message.mentions.users.first()
    let banuser = message.guild.member(bbanuser)
    let banreason = args.join(" ").slice(22);
    let userid = message.member.id
    if(banuser) {
        if(banreason) {
            con.query(`SELECT * FROM staffs WHERE staffid = '${userid}'`, (err1, row1) => {
                if(row1[0] && row1[0].rangering === 'Staff' || row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
                    banuser.kick({reason: banreason}).then(() => { 
                        const banEmbed = {
                            color: 0x37ae5f,
                            author: {
                                name: bbanuser.username + '#' + bbanuser.discriminator + ' er blevet smidt ud', 
                                icon_url: bbanuser.avatarURL()
                            },
                            description: '**Grund:** '+banreason
                        };
                        message.delete()
                        message.channel.send({embed: banEmbed})
                    })
                } else {                    
                    message.delete();
                }
            })
        } else {  
            message.delete();
        }
    } else {
        message.delete();
    }
}

module.exports.help = {
  name: "kick"
}