const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("discord")
        .setDescription("Info om discorden"),
    execute: (client, interaction, options) => {

        const { Discord, config } = options;

        const whitelistRole = client.guilds.cache.get(config.guildId).roles.cache.find(role => role.id === "881265130426482699");
        const earlyRole = client.guilds.cache.get(config.guildId).roles.cache.find(role => role.id === "882349346279030794");
        const devRole = client.guilds.cache.get(config.guildId).roles.cache.find(role => role.id === "854074228370046986");
        const staffRole = client.guilds.cache.get(config.guildId).roles.cache.find(role => role.id === "910511137613819964");

        let whitelistarr = new Array();
        let whitelistcount = 0;
        let earlyarr = new Array();
        let earlycount = 0;
        let devarr = new Array();
        let devcount = 0;
        let staffarr = new Array();
        let staffcount = 0;

        whitelistRole.members.forEach(member => {
            whitelistarr.push(`${member.user.username}\n`);
            whitelistcount++;
        });

        earlyRole.members.forEach(member => {
            earlyarr.push(`${member.user.username}\n`);
            earlycount++;
        });

        devRole.members.forEach(member => {
            devarr.push(`${member.user.username}\n`);
            devcount++;
        });

        staffRole.members.forEach(member => {
            staffarr.push(`${member.user.username}\n`);
            staffcount++;
        });

        const embed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setTitle("Discord Info")
            .addFields(
                {
                    name: "Standard roller",
                    value: "```Whitelist: " + whitelistcount + "\nEarly Access: " + earlycount + "```",
                    inline: true
                },
                {
                    name: "Staff roller",
                    value: "```Dev: " + devcount + "\nStaff: " + staffcount + "```",
                    inline: true
                }
            )

        interaction.reply({ embeds: [embed] });

    }
}