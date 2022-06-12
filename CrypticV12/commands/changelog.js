const mysql = require('mysql');
const config = require("../configs/database.json");

const con = mysql.createConnection({
  host     : config.cryptic.host,
  user     : config.cryptic.user,
  password : config.cryptic.pass,
  database : config.cryptic.db,
});

var typer = ["tilføj", "fjern", "ændring", "vis", "release", "wipe"]

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
                  if(row1.length > 0) {
                    var tilføjelser = '✅ **Tilføjet:** ' + row1[0].ændring + '\n'
                    for(i = 1; i < row1.length; i++) {
                      var tilføjelse = '✅ **Tilføjet:** ' + row1[i].ændring
                      tilføjelser = tilføjelser + tilføjelse + "\n"
                    }
                  } else {
                    var tilføjelser = 'Ingen nye ting i denne omgang'
                  }
                  con.query(`SELECT * FROM fjernet`, (err2, row2, res2) => {
                    if (row2.length > 0) {
                      var fjernelser = '❌ **Fjernet:** ' + row2[0].ændring + '\n'
                      for(i = 1; i < row2.length; i++) {
                        var fjernelse = '❌ **Fjernet:** ' + row2[i].ændring
                        fjernelser = fjernelser + fjernelse + '\n'
                      }
                    } else {
                      var fjernelser = 'Ingen ting er fjernet i denne omgang'
                    }
                    con.query(`SELECT * FROM ændret`, (err3, row3, res3) => {
                      if (row3.length > 0) {
                        var ændringer = '⚙️ **Ændret:** ' + row3[0].ændring + '\n'
                        for(i = 1; i < row3.length; i++) {
                          var ændring = '⚙️ **Ændret:** ' + row3[i].ændring
                          ændringer = ændringer + ændring + '\n'
                        }
                      } else {
                        var ændringer = 'Ingen ting er ændret i denne omgang'
                      }
                      var d = new Date,
                      dformat = "d. " + [d.getDate(),d.getMonth()+1,d.getFullYear()].join('/');
                      const changelog = {
                        color: 0x37ae5f,
                        title: 'Changelog',
                        fields: [
                            {
                                name: 'Tilføjede ting',
                                value: tilføjelser
                            },
                            {
                              name: 'Fjernede ting',
                              value: fjernelser
                            },
                            {
                              name: 'Ændrede ting',
                              value: ændringer
                            },
                        ],
                        footer: {
                          text: 'Udgivet '+dformat+' på vegne af Cryptic Development'
                        }
                      };
                      message.author.send({embed: changelog})
                      message.delete()
                    })
                  })
                })
              } else if (type === typer[4]) {
                con.query(`SELECT * FROM tilføjet`, (err1, row1, res1) => {
                  if(row1.length > 0) {
                    var tilføjelser = '✅ **Tilføjet:** ' + row1[0].ændring + '\n'
                    for(i = 1; i < row1.length; i++) {
                      var tilføjelse = '✅ **Tilføjet:** ' + row1[i].ændring
                      tilføjelser = tilføjelser + tilføjelse + "\n"
                    }
                  } else {
                    var tilføjelser = 'Ingen nye ting i denne omgang'
                  }
                  con.query(`SELECT * FROM fjernet`, (err2, row2, res2) => {
                    if (row2.length > 0) {
                      var fjernelser = '❌ **Fjernet:** ' + row2[0].ændring + '\n'
                      for(i = 1; i < row2.length; i++) {
                        var fjernelse = '❌ **Fjernet:** ' + row2[i].ændring
                        fjernelser = fjernelser + fjernelse + '\n'
                      }
                    } else {
                      var fjernelser = 'Ingen ting er fjernet i denne omgang'
                    }
                    con.query(`SELECT * FROM ændret`, (err3, row3, res3) => {
                      if (row3.length > 0) {
                        var ændringer = '⚙️ **Ændret:** ' + row3[0].ændring + '\n'
                        for(i = 1; i < row3.length; i++) {
                          var ændring = '⚙️ **Ændret:** ' + row3[i].ændring
                          ændringer = ændringer + ændring + '\n'
                        }
                      } else {
                        var ændringer = 'Ingen ting er ændret i denne omgang'
                      }
                      var d = new Date,
                      dformat = "d. " + [d.getDate(),d.getMonth()+1,d.getFullYear()].join('/');
                      const changelog = {
                        color: 0x37ae5f,
                        title: 'Changelog',
                        fields: [
                            {
                                name: 'Tilføjede ting',
                                value: tilføjelser
                            },
                            {
                              name: 'Fjernede ting',
                              value: fjernelser
                            },
                            {
                              name: 'Ændrede ting',
                              value: ændringer
                            },
                        ],
                        footer: {
                          text: 'Udgivet '+dformat+' på vegne af Cryptic Development'
                        }
                      };
                      let changelogC = bot.channels.cache.find(channel => channel.name === "changelog")
                      changelogC.send({embed: changelog})
                      con.query(`DELETE FROM tilføjet WHERE ændring IS NOT NULL`)
                      con.query(`DELETE FROM fjernet WHERE ændring IS NOT NULL`)
                      con.query(`DELETE FROM ændret WHERE ændring IS NOT NULL`)
                      message.delete()
                    })
                  })
                })
              } else if (type === typer[5]) {
                message.delete()
                con.query(`DELETE FROM tilføjet`)
                con.query(`DELETE FROM ændret`)
                con.query(`DELETE FROM fjernet`)
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