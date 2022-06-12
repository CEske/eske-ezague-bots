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

var ranks = ["bypass", "Ledelse", "Staff", "WL", "Developer", "EDeveloper", "fyret"];

function opdaterRank(id, rank) {
  var d = new Date,
  date = [d.getMonth()+1,d.getDate(),d.getFullYear()].join('/');
  con.query(`SELECT * FROM staffs WHERE staffid = ${id}`, (error, rows, results) => {
    if(!rows[0]) {
        con.query(`INSERT INTO staffs VALUES ('${id}', '${rank}', '${date}');`)         
    } else {
        con.query(`UPDATE staffs SET rangering = '${rank}', ændring = '${date}' WHERE staffid = '${id}'`)
    }
})
}

module.exports.run = async (bot, message, args) => {
  let staff = message.mentions.members.first()
  let admin = message.member.id
  let rank = args[1]
  if(staff && rank) {
    if(ranks.includes(rank)) {
      con.query(`SELECT * FROM staffs WHERE staffid = '${admin}'`, (err1, row1) => {
          if(row1[0] && row1[0].rangering === 'Ledelse' || row1[0] && row1[0].rangering === 'bypass') {
            message.delete();
            opdaterRank(staff.id, rank);
            message.channel.send(staff + ' har nu fået **' + rank + '**');
          } else {
            message.delete();
            message.channel.send('<@'+admin+'>, du har ikke tilladelse til !rank');
          }
      })
    } else {
      message.delete();
      message.channel.send('<@'+admin+'>, **'+rank+'** eksisterer ikke');
    }
  } else {
    message.delete()
  }
}

module.exports.help = {
  name: "rank"
}