const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Tjekker ping"),
    execute: async (client, interaction, options) => {

        const { Discord, config } = options;
        const message = await interaction.reply({ content: `Regner ping ud`, fetchReply: true });

        const embed = new Discord.MessageEmbed()
            .setTitle('Ping')
            .setColor(config.color)
            .setDescription(
                `Ping: ${Math.floor(message.createdTimestamp - interaction.createdTimestamp,)}ms\nAPI Ping: ${client.ws.ping}ms`);

        await interaction.editReply({ embeds: [embed] });

    }
}