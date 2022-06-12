const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ranks")
        .setDescription("Viser en spillers ranks")
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
        let id = interaction.options.getString("id");

        let grupperSamlet = "";

        con.query(`SELECT * FROM character_data WHERE cid = ?`, [id], (err, res) => {
            if (err) throw err;
            if (res.length < 1) return interaction.reply({ content: `Karakter findes ikke!`, ephemeral: hidden });
            let grupper = JSON.parse(res[0].groups);
            grupper = Object.keys(grupper);
            for (i = 0; i < grupper.length; i++) {
                grupperSamlet = grupperSamlet + grupper[i] + "\n";
            }

            let embed = new Discord.MessageEmbed()
                .setTitle(`Ranks`)
                .setColor(config.color)
                .addFields(
                    {
                        name: 'ID',
                        value: "```" + id + "```",
                        inline: true,
                    },
                    {
                        name: 'Grupper',
                        value: "```\n" + grupperSamlet + "```",
                        inline: true,
                    }
                )
            return interaction.reply({ embeds: [embed], ephemeral: hidden });
        })
    }
}