const { SlashCommandBuilder } = require('@discordjs/builders');
function genWarnNr() {
    var warnNr = "";
    for (var i = 0; i < 5; i++) {
        warnNr += Math.floor(Math.random() * 10);
    }
    return warnNr;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn et medlem af discorden")
        .addUserOption(user =>
            user
                .setName("bruger")
                .setDescription("Bruger du vil warn")
                .setRequired(true)
        )
        .addStringOption(string =>
            string
                .setName("reason")
                .setDescription("Grunden til warn")
                .setRequired(true)
        )
        .addBooleanOption(boolean =>
            boolean
                .setName("skjult")
                .setDescription("Skal commanden vises til alle?")
        ),
    execute: (client, interaction, options) => {

        const { Discord, con, config } = options;

        let hidden = interaction.options.getBoolean('skjult')
        const user = interaction.options.getUser("bruger");
        const reason = interaction.options.getString("reason");

        con.query(`SELECT * FROM players WHERE id = ?`, [user.id], (err, row) => {
            if (row.length > 0) {
                let json = JSON.parse(row[0].punishments);
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Warn`)
                    .addFields(
                        {
                            name: `Bruger`,
                            value: "```" + user.user.tag + "```",
                            inline: true
                        },
                        {
                            name: `Bruger ID`,
                            value: "```" + user.id + "```",
                            inline: true
                        },
                        {
                            name: `Grundlag`,
                            value: "```" + reason + "```",
                            inline: false,
                        },
                        {
                            name: `Executor`,
                            value: "```" + interaction.user.tag + "```",
                            inline: true
                        },
                        {
                            name: `Executor ID`,
                            value: "```" + interaction.user.id + "```",
                            inline: true
                        },
                    )
                    .setColor(config.color)

                interaction.reply({ embeds: [embed], ephemeral: hidden });

                let nywarning = {
                    [genWarnNr()]:
                    {
                        by: interaction.user.id,
                        date: Date.now(),
                        reason: reason
                    }
                };
                Object.assign(json.warns, nywarning);
                json = JSON.stringify(json);
                try {
                    con.query(`UPDATE players SET punishments = ?`, [json]);
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log('Ingen spiller');
            }
        });

        const embed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setTitle('Advarsel | Cortex')
            .setDescription(`**Du har fået en advarsel på Cortexrp.dk**\n**Grundlag:** ${reason}\n\n**Du er blevet warned af:** ${interaction.user}`)

        user.send({ embeds: [embed] });

        const logembed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setTitle('Command logs')
            .addFields(
                {
                    name: 'Command',
                    value: '```Warn```',
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
                    name: 'Date and Time',
                    value: "```Dato: " + oldTimestamp.toLocaleDateString() + "\nTid: " + oldTimestamp.toLocaleTimeString() + "```",
                    inline: false,
                },
                {
                    name: 'Channel',
                    value: "```" + interaction.channel.name + "```",
                    inline: true,
                },
                {
                    name: 'Warned user',
                    value: "```" + user.user.tag + "```",
                    inline: true,
                },
                {
                    name: 'Warned user ID',
                    value: "```" + user.user.id + "```",
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: "```" + reason + "```",
                    inline: false,
                },
            )

        const logchannel = client.channels.fetch(config.logchannel);

        return logchannel.send({ embeds: [logembed] }).catch(err => {
            console.log(err)
        })

    }
}