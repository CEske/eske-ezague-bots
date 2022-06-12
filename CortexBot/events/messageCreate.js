module.exports = {
    eventName: "messageCreate",
    disabaled: false,
    type: "on",
    run: async (client, options, message) => {
        const { Discord, config, fs } = options

        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

        if (message.channel.type === 'DM') {
            if (message.author.bot) return;
            let messageArray = message.content.split(" ");
            let args = messageArray

            let embed = new Discord.MessageEmbed()
                .setTitle("DM")
                .setColor(config.color)
                .setDescription(args.join(' '))
                .setFooter(`${message.author.tag} | ${message.author.id}`)

            const logchannel = await client.channels.fetch(config.dmchannel);

            return logchannel.send({ embeds: [embed] }).catch(err => {
                console.log(err)
            })
        }

        fs.readFile("./backend/sticky.json", 'utf8', function (err, content) {
            let json = JSON.parse(content);
            if (message.author.id === '917017380205498459') return;
            for (const [key, value] of Object.entries(json.kanaler)) {
                if (key == message.channel.id && !message.content.startsWith("!sticky")) {
                    client.channels.cache.get(message.channel.id).messages.delete(json.kanaler[key]['beskedid']);
                    message.channel.send(json.kanaler[key]['besked']).then((msg) => {
                        json.kanaler[key]['beskedid'] = msg.id;
                        json = JSON.stringify(json);
                        fs.writeFile("./backend/sticky.json", json, err => {
                            if (err) throw err;
                        })
                    })
                }
            }
        })
    }
}