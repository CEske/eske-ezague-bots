const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Se server information"),
    execute: (client, interaction, options) => {
        const { Discord, config } = options;

        axios.get(`https://servers-frontend.fivem.net/api/servers/single/${config.cfx}`)
            .then(function (response) {
                let online = response['data']['Data']['clients']
                let max = response['data']['Data']['sv_maxclients']

                let embed = new Discord.MessageEmbed()
                    .setColor(config.color)
                    .setTitle(`Server Info`)
                    .addFields(
                        {
                            name: `Antal spillere:`,
                            value: "```" + online + "```",
                            inline: true,
                        },
                        {
                            name: 'Maks antal spillere',
                            value: "```" + max + "```",
                            inline: true,
                        },
                        {
                            name: 'CFX IP',
                            value: "```" + config.cfx + "```",
                            inline: true,
                        },
                    )

                return interaction.reply({ embeds: [embed], ephemeral: true });

            })
            .catch(function (error) {
                console.log(error);
            });

    }
}