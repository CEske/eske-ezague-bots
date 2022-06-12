const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Gør en spiller stum i x antal tid")
        .addUserOption(user =>
            user
                .setName("spiller")
                .setDescription("Spilleren som skal gøres stum")
                .setRequired(true)
        )
        .addChannelOption(channel =>
            channel
                .setName("kanal")
                .setDescription("Kanalen som spilleren skal mutes i")
                .setRequired(true)
        )
        .addStringOption(string =>
            string
                .setName("grund")
                .setDescription("Grunden til at spilleren skal gøres stum")
                .setRequired(true)
        )
        .addStringOption(string => 
            string
                .setName("type")
                .setDescription("Vælg type af tid")
                .setRequired(true)
                .addChoice('Sekunder', 's')
                .addChoice('Minutter', 'm')
                .addChoice('Timer', 't')
                .addChoice('Dage', 'd')
                .addChoice('Uger', 'w')
        )
        .addIntegerOption(integer =>
            integer
                .setName("tid")
                .setDescription("Antal enheder spilleren skal gøres stum")
                .setRequired(true)
        ),
    execute: async (client, interaction, options) => {
        const spiller = interaction.options.getUser("spiller");
        const kanal = interaction.options.getChannel("kanal");
        const type = interaction.options.getString("type");
        const tid = interaction.options.getInteger("tid");
        const grund = interaction.options.getString("grund");
        let timeInMs;
        switch (type) {
            case 'w':
                timeInMs += tid * 604800000;
                break;

            case 'd':
                timeInMs += tid * 86400000;
                break;

            case 't':
                timeInMs += tid * 3600000;
                break;

            case 'm':
                timeInMs += tid * 60000;
                break;

            case 's':
                timeInMs += tid * 1000;
                break;

            default:
                break;
        }
    }
}