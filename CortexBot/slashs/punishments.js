const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("punishments")
        .setDescription("Se spillers straffe")
        .addUserOption(user =>
            user
                .setName("user")
                .setDescription("User du vil tjekke")
                .setRequired(true)
        )
        .addBooleanOption(boolean =>
            boolean
                .setName("skjult")
                .setDescription("Skal commanden vises til alle?")
        ),
    execute: (client, interaction, options) => {
        const { con } = options;

        let hidden = interaction.options.getBoolean('skjult')
        const user = interaction.options.getUser("user")

        con.query(`SELECT punishments FROM players WHERE id = ?`, [user.id], (err, row) => {
            if (row.length > 0) {
                const json = JSON.parse(row[0].punishments);
                let warns = '';
                let bans = '';
                let kicks = '';
                for (var k in json.warns) {
                    warns += `Nr: ${k} | Dato: <t:${Math.floor(json['warns'][k].date / 1000)}:f> | Grund: ${json['warns'][k].reason} | Af: <@${json['warns'][k].by}>\n`;
                }
                for (var k in json.kicks) {
                    kicks += `Dato: <t:${Math.floor(json['warns'][k].date / 1000)}:f> | Grund: ${json['kicks'][k].reason} | Af: <@${json['kicks'][k].by}>\n`;
                }
                for (var k in json.bans) {
                    bans += `Dato: <t:${Math.floor(json['warns'][k].date / 1000)}:f> | Grund: ${json['bans'][k].reason} | Af: <@${json['bans'][k].by}>\n`;
                }
                interaction.reply({ content: `Warns:\n-------\n${warns}\n-------\nBans:\n-------\n${bans}\n-------\nKicks:\n-------\n${kicks}`, ephemeral: hidden });
            }
        })

    }
}