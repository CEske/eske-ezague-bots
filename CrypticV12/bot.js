const Discord = require("discord.js");
const fs = require("fs");
const config = require("./configs/discord.json");
const bot = new Discord.Client({disableEveryone: true});
const mysql = require("mysql");
bot.commands = new Discord.Collection();
const db = require("./configs/database.json");
const con = mysql.createConnection({
  host     : db.cryptic.host,
  user     : db.cryptic.user,
  password : db.cryptic.pass,
  database : db.cryptic.db,
});

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Ingen kommandoer kunne findes.");
        return;
    }
  
    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        console.log(`${f} loadet!`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("ready", async () => {
    bot.user.setActivity("Ansøg på Cryptic.dk", {type: "PLAYING"});
});

bot.on("guildMemberAdd", function(member) {
    let test = bot.channels.cache.get('787082400009551924');
    test.send('*Velkommen til **Cryptic**, <@'+member+'>! Har du nogen spørgsmål ift. Whitelist eller andet, stil dem gerne i <#787086023276494868> ellers tag et kig i <#787086629965135873> for yderligere whitelist information!*')
    member.roles.add('787088073892691979')
})

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
  
    let prefix = config.discord.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);
});

bot.on("message", async message => {
    if (message.author.bot) return;
    let id = message.member.id
    con.query(`SELECT * FROM mute WHERE spillerid = '${id}'`, (err2, row2) => {
        if(row2[0]) {
            message.delete();
        }
    })
});

bot.on("messageDelete", function(message){
    if (message.author.bot) return;
    if (message.content.includes("!")) return;
    let msgChannel = bot.channels.cache.find(channel => channel.name === "discord-logs")
    const messageChange = {
        color: 0x37ae5f,
        author: {
            name: message.author.username + '#' + message.author.discriminator + ' fik slettet en besked', 
            icon_url: message.author.avatarURL()
        },
        description: '**Besked:** '+message.content
    };
    msgChannel.send({embed: messageChange})

});

bot.on("emojiCreate", function(emoji) {
    let msgChannel = bot.channels.cache.find(channel => channel.name === "discord-logs")
    const messageChange = {
        color: 0x37ae5f,
        author: {
            name: 'Der er blevet tilføjet en ny emoji - jubiiii',
            icon_url: 'https://cdn.discordapp.com/attachments/787053886174134292/788085575701626880/cryptic.png'
        },
        description: emoji + ' er blevet tilføjet'
    };
    msgChannel.send({embed: messageChange})     
})

bot.on("emojiDelete", function(emoji) {
    let msgChannel = bot.channels.cache.find(channel => channel.name === "discord-logs")
    const messageChange = {
        color: 0x37ae5f,
        author: {
            name: 'Der er blevet slettet en emoji - øv bøv',
            icon_url: 'https://cdn.discordapp.com/attachments/787053886174134292/788085575701626880/cryptic.png'
        },
        description: emoji + ' er blevet slettet'
    };
    msgChannel.send({embed: messageChange})     
})

bot.on("messageUpdate", function(oldMessage, newMessage) {
    if (oldMessage.author.bot) return;
    let msgChannel = bot.channels.cache.find(channel => channel.name === "discord-logs")
    const messageChange = {
        color: 0x37ae5f,
        author: {
            name: oldMessage.author.username + '#' + oldMessage.author.discriminator + ' ændrede en besked', 
            icon_url: oldMessage.author.avatarURL()
        },
        description: '**Fra:** '+oldMessage.content+'\n**Til:** '+newMessage.content
    };
    msgChannel.send({embed: messageChange})    
})

bot.on("message", async message => {
    if(message.content.includes('discord.gg/' || 'discordapp.com/invite/' || 'pornhub.com' || 'xnxx.com' || 'sexaben.dk' || 'pornhub')) {
        message.delete()
        let msgChannel = bot.channels.cache.find(channel => channel.name === "discord-logs")
        const messageChange = {
            color: 0x37ae5f,
            author: {
                name: message.author.username + '#' + message.author.discriminator + ' sendte et forbudt link', 
                icon_url: message.author.avatarURL()
            },
            description: '**Besked:** '+message.content
        };
        msgChannel.send({embed: messageChange}) 
    }
})

bot.on("ready", async () => {
    con.query(`SELECT * FROM ticketsystem`, (err2, row2) => {
        let beskedid = row2[0].beskedid
        let channelid = row2[0].channel
        bot.channels.cache.get(channelid).messages.delete(beskedid)
        let channel = bot.channels.cache.get(channelid)
        const ticketEmbed = {
            color: 0x37ae5f,
            author: {
                name: 'Cryptic Ticket', 
                icon_url: 'https://cdn.discordapp.com/attachments/787053886174134292/788085575701626880/cryptic.png'
            },
            description: 'Reager med 📩 for at åbne en ticket!'
        };
        channel.send({embed: ticketEmbed}).then((msg) => {
            msg.react('📩')
            con.query(`UPDATE ticketsystem SET beskedid = '${msg.id}'`)
        })
    })
});

bot.on("message", async message => {
    if (message.author.bot) return;
    fs.readFile("./sticky.json", 'utf8', function(err, content) {
        let json = JSON.parse(content)
        let kanaler = Object.values(json.kanaler).find(value => value.kanalid === message.channel.id)
        if(kanaler) {
            if (kanaler.status === '1') {
                let beskedd = kanaler.beskedid
                if (!message.content.startsWith("!sticky")) {
                    message.channel.send(kanaler.besked).then((msg) => {
                        kanaler.beskedid = msg.id
                        json = JSON.stringify(json)
                        fs.writeFile("./sticky.json", json, err => {
                            if (err) throw err;
                        })
                    })
                }
                bot.channels.cache.get(message.channel.id).messages.delete(beskedd)
            }
        }
    }) 
})

bot.on("message", async message => {
    if(message.channel.id === '787086812849766431') {
        if(message.content.includes("godkendt")) {
            let spiller = message.mentions.users.first()
            let spilerr = message.guild.member(spiller)
            if(!spiller) return;
            if(!spilerr) return;
            spilerr.roles.add('791028814267547679')
            spilerr.roles.remove('787088073892691979')
        } else {
            return;
        }
    } else {
        return;
    }
})

bot.on("messageReactionAdd", (reaction, user) => {
    if(user.bot) return;
    let spillerid = user.id
    con.query(`SELECT * FROM ticketsystem`, (err1, row1) => {
        let beskedid = row1[0].beskedid
        if (reaction.message.id === beskedid) {
            reaction.users.remove(user.id)
            con.query(`SELECT spillerid FROM tickets WHERE spillerid = '${spillerid}'`, (err2, row2) => {
                if(row2[0]) {
                    user.send(`Du har allerede en ticket åben`)
                } else {
                    let ticketChannel = bot.channels.cache.find(channel => channel.name === "ticket-logs")
                    let ticketnummer = row1[0].ticketnummer
                    const channel = reaction.message.guild.channels.create(`ticket-${ticketnummer}`, {
                        parent: '788395591767949333'
                    }).then((c) => {
                        c.lockPermissions()
                        c.overwritePermissions([
                            {
                                id: reaction.message.guild.id,
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: user.id,
                                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                            },
                            {
                                id: '787087820258541588',
                                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                            },
                        ])
                        con.query(`INSERT INTO tickets VALUES('${spillerid}','${c.id}')`)
                        const muteEmbed = {
                            color: 0x37ae5f,
                            author: {
                                name: 'Hvad gør jeg nu?', 
                                icon_url: 'https://cdn.discordapp.com/attachments/787053886174134292/788085575701626880/cryptic.png'
                            },
                            description: 'Du har oprettet en ticket. Heri kan du stille spørgsmål, efterspørge ting og få løst dine problemer.\nFor at lukke ticketten bedes du reagere med 🔒.'
                        };
                        const ticketLog = {
                            color: 0x37ae5f,
                            author: {
                                name: user.username + '#' + user.discriminator + ' åbnede en ticket', 
                                icon_url: user.avatarURL()
                            },
                            description: 'Ticketnummer '+ticketnummer
                        };
                        c.send({embed: muteEmbed}).then((msg) => {
                            msg.react('🔒')
                        })
                        ticketChannel.send({embed: ticketLog})
                        c.send('<@&787087820258541588>').then((msg) => {
                            msg.delete()
                        })
                    });
                    ticketnummer = ticketnummer + 1
                    con.query(`UPDATE ticketsystem SET ticketnummer = '${ticketnummer}'`)
                }
            })
        }
    })
})

bot.on("messageReactionAdd", (reaction, user) => {
    if (user.bot) return;
    if(reaction.message.channel.parent.id === '788395591767949333') {
        if(reaction.emoji.name === '🔒') {
            con.query(`SELECT * FROM tickets WHERE channelid = '${reaction.message.channel.id}'`, (err1, row1) => {
                let channelid = row1[0].channelid
                let spiller = row1[0].spillerid
                let channel = bot.channels.cache.get(channelid)
                let ticketChannel = bot.channels.cache.find(channel => channel.name === "ticket-logs")
                const ticketLog = {
                    color: 0x37ae5f,
                    author: {
                        name: user.username + '#' + user.discriminator + ' lukkede '+channel.name, 
                        icon_url: user.avatarURL()
                    },
                    description: '<@'+spiller+'> fik lukket en ticket'
                };
                channel.delete()
                ticketChannel.send({embed: ticketLog})
                con.query(`DELETE FROM tickets WHERE channelid = '${reaction.message.channel.id}'`)
            })
        }
    }
})

setInterval(function() {
    let nu = new Date().getTime()
    con.query(`SELECT * FROM mute`, (err1, row1, res1) => {
        if (row1) {
            for(spiller = 0; spiller < row1.length; spiller++) {
                let id = row1[spiller].spillerid;
                let udløb = row1[spiller].expire;
                let udregning1 = udløb-nu

                if (udregning1 < 1) {
                    con.query(`DELETE FROM mute WHERE spillerid = '${id}'`);
                }
            }
        }
    })
}, 5000);

bot.login(config.discord.token)