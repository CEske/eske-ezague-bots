const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban et medlem fra discord")
        .addUserOption(user =>
            user
                .setName("user")
                .setDescription("Personen du vil banne")
                .setRequired(true)
        )
        .addStringOption(string =>
            string
                .setName("reason")
                .setDescription("Grunden til kick")
                .setRequired(true)
        )
        .addBooleanOption(boolean =>
            boolean
                .setName("skjult")
                .setDescription("Skal commanden vises til alle?")
        ),
    execute: async (client, interaction, options) => {

        const { Discord, config } = options;

        const timestamp = Date.now();
        const oldTimestamp = new Date(timestamp);

        let hidden = interaction.options.getBoolean('skjult')
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        await user.ban({
            reason: reason,
        }).then(() => {
            con.query(`SELECT * FROM players WHERE id = ?`, [user.id], (err, row) => {
                if (row.length > 0) {
                    let json = JSON.parse(row[0].punishments);
                    let nyban = {
                        [Date.now()]:
                        {
                            by: interaction.user.id,
                            date: Date.now(),
                            reason: reason
                        }
                    };
                    Object.assign(json.bans, nyban);
                    json = JSON.stringify(json);
                    try {
                        con.query(`UPDATE players SET punishments = ?`, [json]);
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
            const embed = new Discord.MessageEmbed()
                .setTitle(`Ban`)
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
        })

        const logembed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setTitle('Command logs')
            .addFields(
                {
                    name: 'Command',
                    value: '```ban```',
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
                    name: 'Banned user',
                    value: "```" + user.user.tag + "```",
                    inline: true,
                },
                {
                    name: 'Banned user ID',
                    value: "```" + user.user.id + "```",
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: "```" + reason + "```",
                    inline: false,
                },
            )

        const logchannel = await client.channels.fetch(config.logchannel);

        return logchannel.send({ embeds: [logembed] }).catch(err => {
            console.log(err)
        })

    }
}