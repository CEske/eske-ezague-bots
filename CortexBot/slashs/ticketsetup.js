const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticketsetup")
        .setDescription("Setup af tickets"),
    execute: async (client, interaction, options) => {

        const { Discord, config } = options;

        const embed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setTitle('Opret en ticket')
            .setDescription(`Har du brug for hjælp, er du kommet til det rette sted!\nOpret en ticket og få en snak med staff teamet, bag lukkede døre.`)
            .setFooter(`@CortexRP`, interaction.guild.iconURL())

        const btn = new Discord.MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Opret ticket')
            .setCustomId('opret_ticket')

        const btnticket = new Discord.MessageActionRow()
            .addComponents(
                btn
            );

        interaction.reply({ content: 'Knapper oprettet', ephemeral: true })

        await interaction.channel.send({ embeds: [embed], components: [btnticket] })
    }
}