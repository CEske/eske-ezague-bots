const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pingsetup")
        .setDescription("Setup af ping knapper"),
    execute: async (client, interaction, options) => {
        const { Discord, con, config } = options;

        let addping = new Discord.MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Tilføj Ping')
            .setCustomId('addping')

        let delping = new Discord.MessageButton()
            .setStyle('DANGER')
            .setLabel('Fjern Ping')
            .setCustomId('delping')

        const pingbtn = new Discord.MessageActionRow()
            .addComponents(
                addping,
                delping
            );

        const embed = new Discord.MessageEmbed()
            .setTitle('Ping Rolle')
            .setDescription('Tryk på knappen under for at modtage en ping rolle\nVi bruger den til at informere folk om mindre relevante ting, som everyone ikke behøver at vide.')
            .setColor(config.color)

        interaction.reply({ content: 'Knapper oprettet', ephemeral: true })

        await interaction.channel.send({ embeds: [embed], components: [pingbtn] });

    }
}