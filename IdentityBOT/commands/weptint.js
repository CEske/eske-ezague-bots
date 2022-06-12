const { giveWeptint, remWeptint } = require('../functions/wep.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("weptint")
        .setDescription("Giv eller fjern tilladelse til /weptint")
        .addSubcommand(subcommand =>
            subcommand
                .setName("fjern")
                .setDescription("Fjern tilladelse")
                .addStringOption(string =>
                    string
                        .setName("steam")
                        .setDescription("Steam identifier på spilleren")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("giv")
                .setDescription("Giv tilladelse")
                .addStringOption(string =>
                    string
                        .setName("steam")
                        .setDescription("Steam identifier på spilleren")
                        .setRequired(true)
                )
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
        const { Discord, config } = options;

        if (interaction.options.getSubcommand() === 'fjern') {
            remWeptint(interaction.options.getString('steam'));
            interaction.reply({ content: `**${interaction.options.getString('steam')}**'s til weptint er nu fjernet`, ephemeral: true });
        } else if (interaction.options.getSubcommand() === 'giv') {
            giveWeptint(interaction.options.getString('steam'), interaction.options.getString('nynummerplade'));
            interaction.reply({ content: `**${interaction.options.getString('steam')}** fik tilladelse til weptint`, ephemeral: true });
        }
    }
}