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

const fivem = mysql.createConnection({
    host     : config.fivem.host,
    user     : config.fivem.user,
    password : config.fivem.pass,
    database : config.fivem.db,
  });


module.exports.run = async (bot, message, args) => {
    let spiller = args[0]
    let staffid = message.member.id
    if(spiller) {
        con.query(`SELECT * FROM staffs WHERE staffid = '${staffid}'`, (err1, row1) => {
            if(row1[0] && row1[0].rangering === 'Staff' || row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
                fivem.query(`SELECT * FROM vrp_user_data WHERE user_id = '${spiller}'`, (err2, row2) => {
                    if (row2[0]) {
                        parsedData = JSON.parse(row2[1].dvalue)
                        var alleranks = Object.keys(parsedData.groups)
                        let alleranks1 = ""
                        for(i = 0; i < alleranks.length; i++) {
                            var ranknavn = alleranks[i]
                            alleranks1 = alleranks1 + ranknavn + "\n"
                        }
                        const muteEmbed = {
                            color: 0x37ae5f,
                            author: {
                                name: message.author.username + '#' + message.author.discriminator + ' har lige tjekket ranks på ID '+spiller, 
                                icon_url: message.author.avatarURL
                            },
                            fields: [
                                {
                                    name: '**ID:** '+spiller+' har følgende ranks',
                                    value: alleranks1
                                }
                            ]
                        };
                        message.delete()
                        let msgChannel = bot.channels.find(`name`, "bot-logs")
                        msgChannel.send({embed: muteEmbed})
                    } else {                    
                        message.delete();
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
  name: "ranks"
}