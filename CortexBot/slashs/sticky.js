const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("sticky")
        .setDescription("Klistr en besked til en kanal")
        .addStringOption(string =>
            string
                .setName("besked")
                .setDescription("Beskeden du vil klistr (Skriv fjern for at fjerne)")
                .setRequired(true)
        ),
    execute: (client, interaction, options) => {
        const { fs } = options;

        const stickymsg = interaction.options.getString("besked");
        fs.readFile("./backend/sticky.json", 'utf8', function (err, content) {
            let json = JSON.parse(content);
            if (stickymsg !== "fjern") {
                let fundet = false;
                for (const [key, value] of Object.entries(json.kanaler)) {
                    if (key == interaction.channel.id) {
                        fundet = true;
                        json.kanaler[key]['besked'] = stickymsg;
                        interaction.channel.send(stickymsg).then((msg) => {
                            json.kanaler[key]['beskedid'] = msg.id;
                            json = JSON.stringify(json);
                            interaction.reply({ content: `Du har klistret følgende: ${stickymsg}`, ephemeral: true });
                            fs.writeFile("./backend/sticky.json", json, err => {
                                if (err) throw err;
                            })
                        })
                    }
                }
                if (fundet == false) {
                    interaction.channel.send(stickymsg).then((msg) => {
                        let nytobjekt = {
                            [interaction.channel.id]:
                            {
                                besked: stickymsg,
                                beskedid: msg.id
                            }
                        }
                        Object.assign(json.kanaler, nytobjekt);
                        interaction.reply({ content: `Du har klistret følgende: ${stickymsg}`, ephemeral: true });
                        json = JSON.stringify(json);
                        fs.writeFile("./backend/sticky.json", json, err => {
                            if (err) throw err;
                        })
                    })
                }
            } else {
                Reflect.deleteProperty(json.kanaler, [interaction.channel.id]);
                json = JSON.stringify(json);
                interaction.reply({ content: "Du har fjernet sticky beskeden", ephemeral: true });
                fs.writeFile("./backend/sticky.json", json, err => {
                    if (err) throw err;
                })
            }
        })
    }
}