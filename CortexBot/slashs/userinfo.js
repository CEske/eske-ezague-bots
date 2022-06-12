const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Se userinfo på spiller")
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

        con.query(`SELECT * FROM characters INNER JOIN character_data ON characters.cid = character_data.cid INNER JOIN users ON characters.cid = users.id LEFT JOIN vehicles ON characters.cid = vehicles.cid WHERE characters.cid = ?`, [id], (err, res) => {
            if (err) throw err;
            if (res[0].identifier == null) return interaction.reply({ content: 'Karakter findes ikke!', ephemeral: hidden });

            // cars
            let cars = "";
            if (res[0].model == null) {
                cars = "No vehicles.";
            } else {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].model != null) {
                        cars += "Model: " + res[i].model + " | Plate: " + res[i].plate + " | Garage: " + res[i].garage + "\n";
                    } else {
                        break;
                    }
                }
            }

            // characterdata
            let inventory = "";
            let inventoryJSON = JSON.parse(res[0].inventory);
            for (const [key, value] of Object.entries(inventoryJSON)) {
                inventory += key + " (" + inventoryJSON[key]["data"]["amount"] + ") \n";
            }

            let metadata = "";
            let metadataFETCH = ["health", "hunger", "thirst"];
            let metadataJSON = JSON.parse(res[0].metadata);
            for (const [key, value] of Object.entries(metadataJSON)) {
                if (metadataFETCH.includes(key)) {
                    metadata += key + " (" + value + ") \n";
                }
            }

            let groupsTotal = ""
            let groupsJSON = JSON.parse(res[0].groups);
            groupsJSON = Object.keys(groupsJSON);
            for (i = 0; i < groupsJSON.length; i++) {
                groupsTotal += groupsJSON[i] + "\n";
            }

            // res
            let banned = "Nej";
            let whitelisted = "Nej";
            let identifier = "Ukendt";
            let name = "Ukendt";
            if (res[0].banned == 1) { banned = "Ja"; }
            if (res[0].whitelisted == 1) { whitelisted = "Ja"; }
            if (res[0].identifier != null) { identifier = res[0].identifier; }
            if (res[0].name != null) { name = res[0].name; }

            // res
            let firstname = res[0].firstname;
            let lastname = res[0].lastname;
            let bank = res[0].bank;
            let wallet = res[0].wallet;
            let embed = new Discord.MessageEmbed()
                .setTitle('Character information')
                .addFields(
                    {
                        name: 'ID',
                        value: id,
                    },
                    {
                        name: 'Character name',
                        value: " ```First name: " + firstname + "\nLast name: " + lastname + "```",
                        inline: true,
                    },
                    {
                        name: 'Economy',
                        value: " ```\nBank: " + bank + "\nWallet: " + wallet + "```",
                        inline: true,
                    },
                    {
                        name: 'Vehicles',
                        value: "```" + cars + "```",
                    },
                    {
                        name: 'Inventory',
                        value: "```" + inventory + "```",
                        inline: true,
                    },
                    {
                        name: 'Metadata',
                        value: "```" + metadata + "```",
                        inline: true,
                    },
                    {
                        name: 'Groups',
                        value: "```\n" + groupsTotal + "```",
                    },
                )
                .setColor(config.color)
            return interaction.reply({ embeds: [embed], ephemeral: hidden });
        });

    }
}