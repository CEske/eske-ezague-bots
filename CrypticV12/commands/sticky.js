const Discord = require("discord.js");
const mysql = require('mysql');
const sequelize = require('sequelize');
const config = require("../configs/database.json");
const fs = require("fs");
const con = mysql.createConnection({
  host     : config.cryptic.host,
  user     : config.cryptic.user,
  password : config.cryptic.pass,
  database : config.cryptic.db,
});

module.exports.run = async (bot, message, args) => {
    let stickymsg = args.join(" ").slice(0);
    let staffid = message.member.id  
    con.query(`SELECT * FROM staffs WHERE staffid = '${staffid}'`, (err1, row1) => {
        if(row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
            if (stickymsg) {
                fs.readFile("./sticky.json", 'utf8', function(err, content) {
                    let json = JSON.parse(content)
                    let kanaler = Object.values(json.kanaler).find(value => value.kanalid === message.channel.id)
                    if(kanaler) {
                        message.delete()
                        kanaler.besked = stickymsg
                        message.channel.send(stickymsg).then((msg) => {
                            kanaler.beskedid = msg.id
                            kanaler.status = '1'
                            json = JSON.stringify(json)
                            fs.writeFile("./sticky.json", json, err => {
                                if (err) throw err;
                            })
                        })
                    } else {
                        message.delete()
                    }
                })
            } else {
                fs.readFile("./sticky.json", 'utf8', function(err, content) {
                    let json = JSON.parse(content)
                    let kanaler = Object.values(json.kanaler).find(value => value.kanalid === message.channel.id)
                    if(kanaler) {
                        message.delete()
                        kanaler.beskedid = '0'
                        kanaler.status = '0'
                        json = JSON.stringify(json)
                        fs.writeFile("./sticky.json", json, err => {
                            if (err) throw err;
                        })
                    } else {
                        message.delete()
                    }
                })                
            }
        } else {
            message.delete()
        }
    })
}

module.exports.help = {
  name: "sticky"
}