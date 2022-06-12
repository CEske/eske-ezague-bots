const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("oggenok")
        .setDescription("Kommand description")
        .addStringOption(string =>
            string
                .setName("argument1")
                .setDescription("Argument 1 description")
        )
        .setDefaultPermission(false),
    permissions: [
        {
            id: '852302385518346282',
            type: 2, // ROLE = 1, USER = 2
            permission: true
        },
    ],
    execute: (client, interaction, options) => {
        interaction.reply({ content: "Du en oggenok...", ephemeral: true })
    }
}