const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Gør user stum")
        .addUserOption(member =>
            member
                .setName("bruger")
                .setDescription("Bruger du ønsker at gøre stum")
                .setRequired(true)
        )
        .addStringOption(string =>
            string
                .setName("tid")
                .setDescription("Hvor længe brugeren skal være stum")
                .setRequired(true)
        )
        .addStringOption(string =>
            string
                .setName("reason")
                .setDescription("Grunden til mute")
                .setRequired(true)
        )
        .addBooleanOption(boolean =>
            boolean
                .setName("skjult")
                .setDescription("Skal commanden vises til alle?")
        ),
    execute: (client, interaction, options) => {
        const { Discord, config, fs } = options;

        let hidden = interaction.options.getBoolean('skjult')
        const target = interaction.options.getMember("bruger");
        let rawTid = interaction.options.getString("tid");
        const grund = interaction.options.getString("reason");
        const tidInt = rawTid.slice(0, -1);
        const tidType = rawTid.slice(rawTid.length - 1);
        let muteExpire = Date.now();
        let tidModified;

        switch (tidType) {
            case 'w':
                // 1 week in ms
                tidModified = tidInt * 604800000;
                muteExpire += tidModified;
                break;

            case 'd':
                // 1 day in ms
                tidModified = tidInt * 86400000;
                muteExpire += tidModified;
                break;

            case 't':
                // 1 hour in ms
                tidModified = tidInt * 3600000;
                muteExpire += tidModified;
                break;

            case 'm':
                // 1 minute in ms
                tidModified = tidInt * 60000;
                muteExpire += tidModified;
                break;

            case 's':
                // 1 second in ms
                tidModified = tidInt * 1000;
                muteExpire += tidModified;
                break;

            default:
                break;
        }

        fs.readFile("./backend/mute.json", "utf8", function (err, data) {
            if (err) throw err;
            let fundet = false;
            let json = JSON.parse(data);

            for (const key of Object.keys(json.spillere)) {
                if (key == target.id) {
                    json.spillere[k]["expire"] = muteExpire;
                    json.spillere[k]["grund"] = grund;
                    json.spillere[k]["date"] = Date.now();
                    fundet = true;
                }
            }
            if (!fundet) {
                let nytMute = {
                    [target.id]: {
                        date: Date.now(),
                        expire: muteExpire,
                        reason: grund,
                        af: interaction.user.id
                    }
                }
                Object.assign(json.spillere, nytMute);
                json = JSON.stringify(json);
                fs.writeFile("./backend/mute.json", json, function (err) {
                    if (err) throw err;
                });
                target.roles.add(config.muteRole);
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Mute`)
                    .addFields(
                        {
                            name: `Bruger`,
                            value: "```" + target.user.tag + "```",
                            inline: true
                        },
                        {
                            name: `Bruger ID`,
                            value: "```" + target.id + "```",
                            inline: true
                        },
                        {
                            name: `Tid og udløbstid`,
                            value: "```Mute tid: " + rawTid + "\nUdløber: " + new Date(muteExpire).toLocaleString() + "```",
                            inline: false
                        },
                        {
                            name: `Grundlag`,
                            value: "```" + grund + "```",
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

                targetembed = new Discord.MessageEmbed()
                    .setTitle(`Mute | Cortex`)
                    .setDescription(`**Du er blevet muted på Cortexrp.dk**\n**Grundlag:** ${grund}\n**Udløber:** ${new Date(muteExpire).toLocaleString()}\n\n**Du er blevet muted af:** ${interaction.user}`)

                target.send({ embeds: [targetembed] });
            }
        })

    }
}