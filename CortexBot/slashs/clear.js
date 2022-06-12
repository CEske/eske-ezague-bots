const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Fjern et bestemt antal beskeder")
        .addNumberOption(number =>
            number
                .setName("antal")
                .setDescription("Antal beskeder du vil slette")
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
        let delamount = interaction.options.getNumber("antal")
        if (delamount <= 0) return interaction.reply({ content: 'Du skal vælge et tal' });

        await interaction.channel.bulkDelete(parseInt(delamount), true);

        await interaction.reply({ content: `Jeg har slettet ${delamount} beskeder`, ephemeral: hidden });

        const logembed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setTitle('Command logs')
            .addFields(
                {
                    name: 'Command',
                    value: '```clear```',
                    inline: true,
                },
                {
                    name: 'User',
                    value: "```" + interaction.user.tag + "```",
                    inline: true,
                },
                {
                    name: 'User ID',
                    value: "```" + interaction.user.id + "```",
                    inline: true,
                },
                {
                    name: 'Date and time',
                    value: "```Dato: " + oldTimestamp.toLocaleDateString() + "\nTid: " + oldTimestamp.toLocaleTimeString() + "```",
                    inline: false,
                },
                {
                    name: 'Channel',
                    value: "```" + interaction.channel.name + "```",
                    inline: true,
                },
                {
                    name: 'Number of messages',
                    value: "```" + delamount + "```",
                    inline: true
                },
            )

        const logchannel = await client.channels.fetch(config.logchannel);

        return logchannel.send({ embeds: [logembed] }).catch(err => {
            console.log(err)
        })
    }
}