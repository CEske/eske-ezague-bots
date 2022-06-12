module.exports = {
    eventName: "messageCreate",
    disabaled: false,
    type: "on",
    run: async (client, options, message) => {
        const { Discord, config, fs } = options

        const args = message.content.slice(0).trim().split(/ +/g);

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
    }
}