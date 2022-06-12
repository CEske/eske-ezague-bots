
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("money")
        .setDescription("Giv penge til en user ingame")
        .addSubcommand(subcommand =>
            subcommand
                .setName("give")
                .setDescription("Giv penge til en user ingame")
                .addStringOption(string =>
                    string
                        .setName('id')
                        .setDescription('ID på den user der skal modtage penge')
                        .setRequired(true)
                )
                .addIntegerOption(integer =>
                    integer
                        .setName('amount')
                        .setDescription('Antal penge der skal gives')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Fjern penge fra en user ingame")
                .addStringOption(string =>
                    string
                        .setName('id')
                        .setDescription('ID på den user der skal fjernes penge')
                        .setRequired(true)
                )
                .addIntegerOption(integer =>
                    integer
                        .setName('amount')
                        .setDescription('Antal penge der skal fjernes')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("set")
                .setDescription("Sæt penge på en user ingame")
                .addStringOption(string =>
                    string
                        .setName('id')
                        .setDescription('ID på den user der skal have penge sat')
                        .setRequired(true)
                )
                .addIntegerOption(integer =>
                    integer
                        .setName('amount')
                        .setDescription('Antal penge der skal sættes')
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
        const { con } = options;

        if (interaction.options.getSubcommand() === 'give') {
            con.query(`SELECT bank FROM users WHERE identifier = ?`, [interaction.options.getString('id')], (err, result) => {
                if (err) throw err;
                if (result.length === 0) {
                    interaction.reply({ content: `Der er ingen bruger med steam ID ${interaction.options.getString('id')}`, ephemeral: true });
                } else {
                    con.query(`UPDATE users SET bank = ? WHERE identifier = ?`, [result[0].bank + interaction.options.getInteger('amount'), interaction.options.getString('id')], (err, res) => {
                        if (err) throw err;
                        interaction.reply({ content: `Brugeren har nu ${result[0].bank + interaction.options.getInteger('amount')} i banken`, ephemeral: true });
                    });
                }
            });
        } else if (interaction.options.getSubcommand() === 'remove') {
            con.query(`SELECT bank FROM users WHERE identifier = ?`, [interaction.options.getString('id')], (err, result) => {
                if (err) throw err;
                if (result.length === 0) {
                    interaction.reply({ content: `Der er ingen bruger med steam ID ${interaction.options.getString('id')}`, ephemeral: true });
                } else {
                    con.query(`UPDATE users SET bank = ? WHERE identifier = ?`, [result[0].bank - interaction.options.getInteger('amount'), interaction.options.getString('id')], (err, res) => {
                        if (err) throw err;
                        interaction.reply({ content: `Brugeren har nu ${result[0].bank - interaction.options.getInteger('amount')} i banken`, ephemeral: true });
                    });
                }
            });
        } else if (interaction.options.getSubcommand() === 'set') {
            con.query(`SELECT bank FROM users WHERE identifier = ?`, [interaction.options.getString('id')], (err, result) => {
                if (err) throw err;
                if (result.length === 0) {
                    interaction.reply({ content: `Der er ingen bruger med steam ID ${interaction.options.getString('id')}`, ephemeral: true });
                } else {
                    con.query(`UPDATE users SET bank = ? WHERE identifier = ?`, [interaction.options.getInteger('amount'), interaction.options.getString('id')], (err, res) => {
                        if (err) throw err;
                        interaction.reply({ content: `Brugeren har nu ${interaction.options.getInteger('amount')} i banken`, ephemeral: true });
                    });
                }
            });
        }
    }
}