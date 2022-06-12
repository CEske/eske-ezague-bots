const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("vehicles")
        .setDescription("Se spillers køretøjer")
        .addStringOption(string =>
            string
                .setName("id")
                .setDescription("Id på spiller")
                .setRequired(true)
        )
        .addBooleanOption(boolean =>
            boolean
                .setName("skjult")
                .setDescription("Skal commanden vises til alle?")
        ),
    execute: (client, interaction, options) => {
        const { Discord, con, config } = options;

        let hidden = interaction.options.getBoolean('skjult')
        let id = interaction.options.getString("id")

        con.query(`SELECT * FROM vehicles WHERE cid = ?`, [id], (err, res) => {
            if (err) {
                return interaction.reply({ content: `Der skete en fejl: ${err}`, ephemeral: hidden });
            }
            if (res.length < 1) {
                return interaction.reply({ content: `Ingen køretøjer fundet`, ephemeral: hidden });
            }

            // biler
            let biler = "";
            if (res[0].model == null) {
                biler = "Ingen køretøjer.";
            } else {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].model != null) {
                        biler += "```Model: " + res[i].model + " | Nummerplade: " + res[i].plate + " | Garage: " + res[i].garage + "\n\n```";
                    } else {
                        break;
                    }
                }
            }

            let embed = new Discord.MessageEmbed()
                .setTitle(`Information ID: ${res[0].cid}`)
                .setColor(config.color)
                .addFields(
                    {
                        name: 'Køretøjer',
                        value: biler,
                    },
                )
            return interaction.reply({ embeds: [embed], ephemeral: hidden });
        });
    }
}