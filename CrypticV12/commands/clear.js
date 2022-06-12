const Discord = require("discord.js");
const mysql = require('mysql');
const config = require("../configs/database.json");
const con = mysql.createConnection({
  host     : config.cryptic.host,
  user     : config.cryptic.user,
  password : config.cryptic.pass,
  database : config.cryptic.db,
});

module.exports.run = async (bot, message, args) => {
    let amount = args[0]
    let userid = message.member.id
    if(amount) {
      con.query(`SELECT * FROM staffs WHERE staffid = '${userid}'`, (err1, row1) => {
        if(row1[0] && row1[0].rangering === 'Staff' || row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
          message.channel.bulkDelete(args[0])
          message.delete()
        } else {
          message.channel.send("Test 2")
          message.delete()
        }
      })
    } else {
      message.channel.send("Test")
      message.delete()
    }
}

module.exports.help = {
  name: "clear"
}