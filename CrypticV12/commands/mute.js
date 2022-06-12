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

function muteSpiller(id, grund, tid, af) {
    let udregning1 = tid*60000
    let nu = new Date().getTime()
    let expire = nu+udregning1
    con.query(`INSERT INTO mute VALUES('${id}','${grund}','${tid}','${af}', '${expire}')`)
}

module.exports.run = async (bot, message, args) => {
    let spiller = message.mentions.users.first()
    let tid = args[1]
    let staffid = message.member.id
    if(spiller && tid) {
        let grund = args.join(" ").slice(23+tid.length);
        if(grund) {
            con.query(`SELECT * FROM staffs WHERE staffid = '${staffid}'`, (err1, row1) => {
                if(row1[0] && row1[0].rangering === 'Staff' || row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass' || row1[0] && row1[0].rangering === 'WL') {
                    muteSpiller(spiller.id, grund, tid, staffid)
                    const muteEmbed = {
                        color: 0x37ae5f,
                        author: {
                            name: spiller.username + '#' + spiller.discriminator + ' er blevet gjort stum', 
                            icon_url: spiller.avatarURL()
                        },
                        description: '**Tid**: '+tid+' minutter\n**Grund:** '+grund
                    };
                    message.delete()
                    message.channel.send({embed: muteEmbed})
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
  name: "mute"
}