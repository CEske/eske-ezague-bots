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
    bot.user.setActivity("Cryptic.dk", {type: "PLAYING"});
  });

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

var cmds = ["!ban", "!clear", "!kick", "!mute", "!rank", "!unmute", "!whitelist"]

bot.on("messageDelete", function(message){
    if (message.author.bot) return;
    if (message.content.includes("!")) return;
    let msgChannel = bot.channels.find(`name`, "discord-logs")
    const messageChange = {
        color: 0x37ae5f,
        author: {
            name: message.author.username + '#' + message.author.discriminator + ' fik slettet en besked', 
            icon_url: message.author.avatarURL
        },
        description: '**Besked:** '+message
    };
    msgChannel.send({embed: messageChange})

});

bot.on("emojiCreate", function(emoji) {
    let msgChannel = bot.channels.find(`name`, "discord-logs")
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
    let msgChannel = bot.channels.find(`name`, "discord-logs")
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
    let msgChannel = bot.channels.find(`name`, "discord-logs")
    const messageChange = {
        color: 0x37ae5f,
        author: {
            name: oldMessage.author.username + '#' + oldMessage.author.discriminator + ' ændrede en besked', 
            icon_url: oldMessage.author.avatarURL
        },
        description: '**Fra:** '+oldMessage+'\n**Til:** '+newMessage
    };
    msgChannel.send({embed: messageChange})    
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

bot.on('guildMemberAdd', async member => {
    console.log(member.id)
});

bot.login(config.discord.token)