const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("botsend")
        .setDescription("Send en besked til en bruger")
        .addUserOption(user =>
            user
                .setName("bruger")
                .setDescription("Brugeren du vil skrive til")
                .setRequired(true)
        )
        .addStringOption(string =>
            string
                .setName("besked")
                .setDescription("Besked du vil skrive")
                .setRequired(true)
        )
        .addBooleanOption(boolean =>
            boolean
                .setName("skjult")
                .setDescription("Skal commanden vises til alle?")
        ),
    execute: async (client, interaction, options) => {

        const { Discord, config } = options;

        let hidden = interaction.options.getBoolean('skjult')
        const timestamp = Date.now();
        const oldTimestamp = new Date(timestamp);

        const user = interaction.options.getUser("bruger");
        const besked = interaction.options.getString("besked");

        let embed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setDescription(`Besked fra ${interaction.guild.name}`)
            .addField(`Besked:`, `**${besked}**`)
            .setFooter(`Mvh\nCortex RP | discord.gg/cortexrp`)

        user.send({ embeds: [embed] }).catch(err => {
            return interaction.reply({ content: `Brugeren har slået dm fra`, ephemeral: hidden });
        })

        interaction.reply({ content: `Besked sendt til ${user.username}`, ephemeral: hidden });

        const logembed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setTitle('Command logs')
            .addFields(
                {
                    name: 'Command',
                    value: '```Botsend```',
                    inline: true,
                },
                {
                    name: 'Executor',
                    value: "```" + interaction.user.tag + "```",
                    inline: true,
                },
                {
                    name: 'Executor ID',
                    value: "```" + interaction.user.id + "```",
                    inline: true,
                },
                {
                    name: 'Date and time',
                    value: "```Dato: " + oldTimestamp.toLocaleDateString() + "\nTid: " + oldTimestamp.toLocaleTimeString() + "```",
                    inline: false,
                },
                {
                    name: 'Message',
                    value: "```" + besked + "```",
                    inline: false,
                },
                {
                    name: 'User',
                    value: "```" + user.username + "```",
                    inline: true,
                },
                {
                    name: 'User ID',
                    value: "```" + user.id + "```",
                    inline: true,
                },
            )

        const logchannel = await client.channels.fetch(config.logchannel);

        return logchannel.send({ embeds: [logembed] }).catch(err => {
            console.log(err)
        })

    }
}