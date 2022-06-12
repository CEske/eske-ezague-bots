const { remVehicle, updateVehicle } = require('../functions/vehicle.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("vehicle")
        .setDescription("Tilføj, fjern eller ændre et køretøj")
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Fjern et køretøj")
                .addStringOption(string =>
                    string
                        .setName("nummerplade")
                        .setDescription("Nummerplade på køretøjet")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("update")
                .setDescription("Opdater et køretøjs nummerplade")
                .addStringOption(string =>
                    string
                        .setName("nummerplade")
                        .setDescription("Nummerplade på køretøjet")
                        .setRequired(true)
                )
                .addStringOption(string =>
                    string
                        .setName("nynummerplade")
                        .setDescription("Ny nummerplade")
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

        if (interaction.options.getSubcommand() === 'remove') {
            remVehicle(interaction.options.getString('nummerplade'));
            interaction.reply({ content: `Køretøjet med nummerplade **${interaction.options.getString('nummerplade')}** er nu fjernet`, ephemeral: true });
        } else if (interaction.options.getSubcommand() === 'update') {
            updateVehicle(interaction.options.getString('nummerplade'), interaction.options.getString('nynummerplade'));
            interaction.reply({ content: `Køretøjet med nummerplade **${interaction.options.getString('nummerplade')}** er nu opdateret til **${interaction.options.getString('nynummerplade')}**`, ephemeral: true });
        }
    }
}