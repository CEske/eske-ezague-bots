const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("whitelist")
        .setDescription("Kommand description")
        .addUserOption(user =>
            user
                .setName("bruger")
                .setDescription("Brugeren du ønsker at give whitelist rank")
                .setRequired(true)
        ),
    execute: (client, interaction, options) => {
        let user = interaction.options.getUser("bruger");
        let whitelistrole = client.guilds.cache.get(config.guildid).roles.cache.find(role => role.id === "938062600149794861");
        user.roles.add(whitelistrole);
        interaction.reply({ content: `${user.username} har nu fået whitelist rollen` });
    }
}