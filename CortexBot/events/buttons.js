const {
    MessageAttachment
} = require('discord.js');

module.exports = {
    eventName: 'interactionCreate',
    disabled: false,
    type: 'on',
    run: async (client, options, interaction) => {
        const {
            Discord,
            config,
            fs
        } = options;

        let timestamp = Date.now();
        let oldTimestamp = new Date(timestamp);

        if (!interaction.isButton()) return;

        if (interaction.customId === "addping") {
            await interaction.deferUpdate();
            if (interaction.member.roles.cache.some(r => r.id === "905537198814806036")) {
                return interaction.member.send({
                    content: "Du kan ikke få **ping** rollen, da du allerede har den."
                })
            }
            await interaction.member.roles.add("905537198814806036");
            const addembed = new Discord.MessageEmbed()
                .setColor(config.color)
                .setTitle("Role update")
                .addFields({
                    name: "Følgende rolle blev tilføjet:",
                    value: "```Ping rolle```",
                    inline: true,
                }, {
                    name: "Tilføjet på tidspunktet:",
                    value: "```" + oldTimestamp.toLocaleDateString() + " " + oldTimestamp.toLocaleTimeString() + "```",
                    inline: true,
                })

            interaction.member.send({
                embeds: [addembed]
            })
        }

        if (interaction.customId === "delping") {
            if (!interaction.member.roles.cache.some(r => r.id === "905537198814806036")) {
                return interaction.member.send({
                    content: "Du kan ikke fjerne **ping** rollen, da du ikke har den."
                })
            }
            await interaction.deferUpdate();
            await interaction.member.roles.remove("905537198814806036");
            const addembed = new Discord.MessageEmbed()
                .setColor(config.color)
                .setTitle("Role update")
                .addFields({
                    name: "Følgende rolle blev fjernet:",
                    value: "```Ping rolle```",
                    inline: true,
                }, {
                    name: "Fjernet på tidspunktet:",
                    value: "```" + oldTimestamp.toLocaleDateString() + " " + oldTimestamp.toLocaleTimeString() + "```",
                    inline: true,
                })
            interaction.member.send({
                embeds: [addembed]
            })
        }

        if (interaction.customId === "opret_ticket") {
            await interaction.deferUpdate();
            if (interaction.channel.parent.id === '900739624765370398') {
                fs.readFile("./backend/tickets.json", 'utf8', function (err, content) {
                    let json = JSON.parse(content);
                    let fundet = false;
                    for (var k in json.tickets) {
                        if (json['tickets'][k].owner === interaction.user.id) {
                            fundet = true;
                        }
                    }
                    if (fundet) {
                        interaction.member.send({
                            content: "Du har allerede en ticket."
                        })
                    } else {
                        const channel = interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                            parent: '900739624765370398'
                        }).then((c) => {
                            let nyticket = {
                                [c.id]: {
                                    owner: interaction.user.id,
                                    opened: Date.now(),
                                }
                            }
                            Object.assign(json.tickets, nyticket);
                            json = JSON.stringify(json);
                            fs.writeFile("./backend/tickets.json", json, err => {
                                if (err) throw err;
                            })
                            c.lockPermissions()
                            c.permissionOverwrites.edit(interaction.user.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                ATTACH_FILES: true
                            })
                            c.permissionOverwrites.edit(interaction.guild.id, {
                                VIEW_CHANNEL: false
                            })
                            c.permissionOverwrites.edit('854074228370046986', {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                ATTACH_FILES: true
                            })
                            const embed = new Discord.MessageEmbed()
                                .setTitle(`Ticket for ${interaction.user.username}`)
                                .setDescription(`Hej ${interaction.user} og velkommen til Cortex Ticket system!\nFor at vi kan hjælpe dig bedst muligt, skal du forklare dit problem på bedste vis!\n\nMulige commands:`)
                                .setFooter(`@CortexRP`, interaction.guild.iconURL())

                            const lukbtn = new Discord.MessageButton()
                                .setStyle('DANGER')
                                .setLabel('Luk ticket')
                                .setCustomId('lukticket')

                            const close = new Discord.MessageActionRow()
                                .addComponents(
                                    lukbtn
                                );

                            c.send({
                                content: 'Tryk på luk ticket for at lukke din ticket',
                                components: [close]
                            })

                            const addbtn = new Discord.MessageButton()
                                .setStyle('SUCCESS')
                                .setLabel('Tilføj bruger')
                                .setCustomId('addticket')

                            const rembtn = new Discord.MessageButton()
                                .setStyle('DANGER')
                                .setLabel('Fjern bruger')
                                .setCustomId('remticket')

                            const addrem = new Discord.MessageActionRow()
                                .addComponents(
                                    addbtn,
                                    rembtn
                                );

                            c.send({
                                embeds: [embed],
                                components: [addrem]
                            })
                        })
                    }
                })
            }
        }

        if (interaction.customId === 'addticket' || interaction.customId === 'remticket') {
            await interaction.deferUpdate();
            interaction.message.guild.members.fetch();
            const filter = m => m.content.match(/\d+/g);
            interaction.channel.send({
                content: 'Venligst angiv ID på brugeren.'
            })
            interaction.channel.awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(collected => {
                let member = interaction.guild.members.cache.get(collected.first().content);

                if (!member) return interaction.channel.send('Venligst angiv et ID der er valid, og er på serveren.');

                if (interaction.customId === 'addticket') {
                    try {
                        interaction.channel.permissionOverwrites.edit(member, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            ATTACH_FILES: true
                        })

                        interaction.channel.send(`${member} var tilføjet til kanalen.`)

                    } catch (err) {
                        console.log(err)
                        return interaction.channel.send('Der skete en fejl!')
                    }
                } else if (interaction.customId === 'remticket') {
                    try {
                        interaction.channel.permissionOverwrites.edit(member, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: false,
                            ATTACH_FILES: false
                        })

                        interaction.channel.send(`${member} var fjernet fra kanalen.`)

                    } catch (err) {
                        console.log(err)
                        return interaction.channel.send('Der skete en fejl!')
                    }
                }
            }).catch(collected => {
                interaction.channel.send("Du skrev ikke et ID i tide.");
            });
        }

        if (interaction.customId === 'lukticket') {
            await interaction.deferUpdate();
            fs.readFile("./backend/tickets.json", 'utf8', function (err, content) {
                let json = JSON.parse(content);
                let svarTid;
                for (var k in json.tickets) {
                    if (k === interaction.channel.id) {
                        svarTid = json['tickets'][interaction.channel.id].opened;
                    }
                }
                svarTid = Date.now() - svarTid;

                function msToTime(duration) {
                    var milliseconds = parseInt((duration % 1000) / 100),
                        seconds = Math.floor((duration / 1000) % 60),
                        minutes = Math.floor((duration / (1000 * 60)) % 60),
                        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

                    hours = (hours < 10) ? "0" + hours : hours;
                    minutes = (minutes < 10) ? "0" + minutes : minutes;
                    seconds = (seconds < 10) ? "0" + seconds : seconds;

                    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
                };

                interaction.channel.messages.fetch({
                    limit: 100
                }).then(async fetched => {
                    const messages = fetched.map(m => `${m.author.tag}: ${m.content}\n`).reverse().join('');
                    const embed = new Discord.MessageEmbed().setTitle(`Svartid: ${msToTime(svarTid)} | ${json['tickets'][interaction.channel.id].owner}`);
                    const attachment = new MessageAttachment(Buffer.from(messages), `${json['tickets'][interaction.channel.id].owner}.txt`);
                    const logchannel = await client.channels.fetch(config.logchannel);
                    client.users.fetch(json['tickets'][interaction.channel.id].owner).then(async (user) => {
                        user.send({
                            embeds: [embed],
                            files: [attachment]
                        });
                        logchannel.send({
                            embeds: [embed],
                            files: [attachment]
                        });
                    });
                });

                interaction.channel.send("Denne ticket lukkes om 10 sekunder. God dag.").then(() => {
                    setTimeout(() => {
                        Reflect.deleteProperty(json.tickets, [interaction.channel.id]);
                        json = JSON.stringify(json);
                        interaction.channel.delete();
                        fs.writeFile("./backend/tickets.json", json, err => {
                            if (err) throw err;
                        })
                    }, 10000);
                });
            })
        }
    }
}