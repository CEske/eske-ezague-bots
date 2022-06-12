const { inlineCode } = require('@discordjs/builders');
module.exports = {
    eventName: 'messageReactionAdd',
    disabled: false,
    type: "on",
    run: async (client, options, reaction, user) => {
        const { Discord, config, con, fs } = options;
        if (reaction.message.channel.parent.id === '900739624765370398') {
            fs.readFile("./backend/tickets.json", 'utf8', function (err, content) {
                let json = JSON.parse(content);
                let fundet = false;
                for (var k in json.tickets) {
                    if (json['tickets'][k].owner === user.id) {
                        fundet = true;
                    }
                }
                if (fundet) {
                    user.send(`Du har allerede en ticket.`);
                    reaction.users.remove(user.id)
                } else {
                    reaction.users.remove(user.id)
                    const channel = reaction.message.guild.channels.create(`${user.username}`, {
                        parent: '900739624765370398'
                    }).then((c) => {
                        let nyticket = {
                            [c.id]:
                            {
                                owner: user.id,
                                opened: Date.now()
                            }
                        }

                        Object.assign(json.tickets, nyticket);
                        json = JSON.stringify(json);
                        fs.writeFile("./backend/tickets.json", json, err => {
                            if (err) throw err;
                        })
                        c.lockPermissions()
                        c.permissionOverwrites.edit(user.id, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            ATTACH_FILES: true
                        })
                        c.permissionOverwrites.edit(reaction.message.guild.id, {
                            VIEW_CHANNEL: false
                        })
                        c.permissionOverwrites.edit('854074228370046986', {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            ATTACH_FILES: true
                        })

                        const embed = new Discord.MessageEmbed()
                            .setTitle(`Ticket for ${user.username}`)
                            .setDescription(`Hej ${user} og velkommen til Cortex Ticket system!\nFor at vi kan hjælpe dig bedst muligt, skal du forklare dit problem på bedste vis!\n\nMulige commands:`)
                            .addFields(
                                {
                                    name: '!ticket tilføj @user',
                                    value: "```Tilføjer @user til din ticket```",
                                    inline: true,
                                },
                                {
                                    name: '!ticket fjern @user',
                                    value: "```Fjerner @user fra din ticket```",
                                    inline: true,
                                },
                            )
                            .setColor(config.color)
                            .setFooter(`Brug venligst !ticket luk for at lukke din ticket.`)
                        c.send({ embeds: [embed] })
                    })
                }
            })
        }
    }
}