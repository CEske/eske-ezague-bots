const mysql = require('mysql');
const config = require("../configs/database.json");

const con = mysql.createConnection({
  host     : config.cryptic.host,
  user     : config.cryptic.user,
  password : config.cryptic.pass,
  database : config.cryptic.db,
});

var typer = ["tilføj", "fjern", "ændring", "vis", "release"]

module.exports.run = async (bot, message, args) => {
  if(message.channel.id === '788012211683196939') {
    let type = args[0]
    let ændring = args.join(" ").slice(type.length);
    let userid = message.member.id
    con.query(`SELECT * FROM staffs WHERE staffid = '${userid}'`, (err0, row0) => {
      if(row0[0] && row0[0].rangering === 'Ledelse' || row0[0] && row0[0].rangering === 'bypass' || row0[0] && row0[0].rangering === 'Developer' || row0[0] && row0[0].rangering === 'EDeveloper') {
        if(type) {
          if(typer.includes(type)) {
            if(ændring) {
              if(type === typer[0]) {
                con.query(`INSERT INTO tilføjet VALUES('${ændring}')`)
                message.delete()
              } else if(type === typer[1]) {
                con.query(`INSERT INTO fjernet VALUES('${ændring}')`)
                message.delete()
              } else if(type === typer[2]) {
                con.query(`INSERT INTO ændret VALUES('${ændring}')`)
                message.delete()
              }
            } else {
              if(type === typer[3]) {
                con.query(`SELECT * FROM tilføjet`, (err1, row1, res1) => {
                  var tilføjelser = ''
                  for(i = 0; i < row1.length; i++) {
                    var tilføjelse = '✅ **Tilføjet:** ' + row1[i].ændring
                    tilføjelser = tilføjelser + tilføjelse + "\n"
                  }
                  con.query(`SELECT * FROM fjernet`, (err2, row2, res2) => {
                    var fjernelser = ''
                    for(i = 0; i < row2.length; i++) {
                      var fjernelse = '❌ **Fjernet:** ' + row2[i].ændring
                      fjernelser = fjernelser + fjernelse + '\n'
                    }
                    con.query(`SELECT * FROM ændret`, (err3, row3, res3) => {
                      var ændringer = ''
                      for(i = 0; i < row3.length; i++) {
                        var ændring = '⚙️ **Ændret:** ' + row3[i].ændring
                        ændringer = ændringer + ændring + '\n'
                      }
                      var samlet = tilføjelser + '\n' + fjernelser + '\n' + ændringer
                      var d = new Date,
                      dformat = "d. " + [d.getMonth()+1,d.getDate(),d.getFullYear()].join('/');
                      var samlet = tilføjelser + '\n' + fjernelser + '\n' + ændringer
                      const changelog = {
                        color: 0x37ae5f,
                        fields: [
                            {
                                name: 'Changelog',
                                value: samlet
                            },
                        ],
                        footer: {
                          text: 'Udgivet '+dformat+' på vegne af Cryptic Development'
                        }
                      };
                      message.author.send({embed: changelog})
                      message.delete(1)
                    })
                  })
                })
              } else if (type === typer[4]) {
                con.query(`SELECT * FROM tilføjet`, (err1, row1, res1) => {
                  var tilføjelser = ''
                  for(i = 0; i < row1.length; i++) {
                    var tilføjelse = '✅ **Tilføjet:** ' + row1[i].ændring
                    tilføjelser = tilføjelser + tilføjelse + "\n"
                  }
                  con.query(`SELECT * FROM fjernet`, (err2, row2, res2) => {
                    var fjernelser = ''
                    for(i = 0; i < row2.length; i++) {
                      var fjernelse = '❌ **Fjernet:** ' + row2[i].ændring
                      fjernelser = fjernelser + fjernelse + '\n'
                    }
                    con.query(`SELECT * FROM ændret`, (err3, row3, res3) => {
                      var ændringer = ''
                      for(i = 0; i < row3.length; i++) {
                        var ændring = '⚙️ **Ændret:** ' + row3[i].ændring
                        ændringer = ændringer + ændring + '\n'
                      }
                      var d = new Date,
                      dformat = "d. " + [d.getMonth()+1,d.getDate(),d.getFullYear()].join('/');
                      var samlet = tilføjelser + '\n' + fjernelser + '\n' + ændringer
                      const changelog = {
                        color: 0x37ae5f,
                        fields: [
                            {
                                name: 'Changelog',
                                value: samlet
                            },
                        ],
                        footer: {
                          text: 'Udgivet '+dformat+' på vegne af Cryptic Development'
                        }
                      };
                      let changelogC = message.guild.channels.find(`name`, "changelog")
                      changelogC.send({embed: changelog})
                      con.query(`DELETE FROM tilføjet WHERE ændring IS NOT NULL`)
                      con.query(`DELETE FROM fjernet WHERE ændring IS NOT NULL`)
                      con.query(`DELETE FROM ændret WHERE ændring IS NOT NULL`)
                      message.delete()
                    })
                  })
                })
              } else {
                message.delete()
              }
            }
          } else {
            message.delete()
          }
        } else {
          message.delete()
        }
      } else {
        message.delete()
      }
    })
  } else {
    message.delete()
  }
}

module.exports.help = {
  name: "changelog"
}