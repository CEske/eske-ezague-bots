const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("oggenok")
        .setDescription("Kommand description")
        .addStringOption(string =>
            string
                .setName("argument1")
                .setDescription("Argument 1 description")
        ),
    execute: (client, interaction, options) => {
        interaction.reply({ content: "Du en oggenok...", ephemeral: true })
    }
}