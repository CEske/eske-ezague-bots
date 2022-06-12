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
    let nummer = args[1]
    if(spillerid) {
      con.query(`SELECT * FROM staffs WHERE staffid = '${userid}'`, (err1, row1) => {
        if(row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
            fivem.query(`SELECT * FROM vrp_user_vehicles WHERE user_id = '${spillerid}'`, (err2, row2) => {
                if (row2[0]) {
                    const fields = row2.map((bil) => {
                        return {
                            name: bil.vehicle_name,
                            value: "Nummerplade: "+bil.vehicle_plate+" | Spawnkode: "+bil.vehicle
                        }
                      })
                      const whitelistEmbed = {
                        color: 0x37ae5f,
                        author: {
                            name: message.author.username + '#' + message.author.discriminator + ' har lige tjekket biler tilhørende ID '+spillerid,
                            icon_url: message.author.avatarURL
                        },
                        fields: fields
                      };
                      message.delete()
                      let msgChannel = bot.channels.find(`name`, "bot-logs")
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
  name: "biler"
}