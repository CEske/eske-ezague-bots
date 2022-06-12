const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Viser info om discorden/botten"),
    execute: (client, interaction, options) => {
        const { Discord, config } = options;

        const moment = require("moment");

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${days} dage, ${hours} timer, ${minutes} minutter ${seconds} sekunder`;

        const embed = new Discord.MessageEmbed()
            .setFooter(`@CortexRP`, 'https://i.imgur.com/QWLT4MI.png')
            .setAuthor(client.user.username, 'https://i.imgur.com/QWLT4MI.png')
            .setColor(config.color)
            .addFields(
                {
                    name: 'Botnavn',
                    value: `:robot: ${client.user.username}`,
                    inline: true,
                },
                {
                    name: 'Botversion',
                    value: `:computer: Discord.js V13.1.0`,
                    inline: true,
                },
                {
                    name: 'Uptime',
                    value: `:alarm_clock: ${uptime}`,
                    inline: true,
                },
                {
                    name: 'Server navn',
                    value: interaction.guild.name,
                    inline: true,
                },
                {
                    name: 'Medlemmer',
                    value: `:gear: ${interaction.guild.memberCount}`,
                    inline: true,
                },
                {
                    name: 'Oprettet den',
                    value: `:calendar: ${moment(interaction.guild.createdAt).format("Do MMMM YYYY, HH:mm:ss")}`,
                    inline: true,
                },
            )
        interaction.reply({ embeds: [embed], ephemeral: true });

    }
}