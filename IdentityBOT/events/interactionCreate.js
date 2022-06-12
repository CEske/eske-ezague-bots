const { discordCommandLog } = require('../functions/dbLog.js');

const PERMS = {
    "none": 0,
    "ban": 2
}

module.exports = {
    eventName: 'interactionCreate',
    disabled: false,
    type: 'on',
    run: async (client, options, interaction) => {
        const { con } = options
        if (!interaction.guild) return;
        const cmd = client.slashcommands.get(interaction.commandName);

        function getUserPerms(userid) {
            return new Promise((resolve, reject) => {
                if (!userid) return;
                con.query(`SELECT * FROM players WHERE id = ?`, [userid], (err, row) => {
                    if (err) return reject(err);
                    if (row[0]) {
                        return resolve(row[0].permissions);
                    }
                })
            });
        }

        // slash commands
        if (interaction.isCommand() && cmd) {
            if (!interaction.user.bot) {
                if (options.debugMode) {
                    try {
                        cmd.execute(client, interaction, options);
                        var log = '';
                        for (const [key, value] of Object.entries(interaction.options["_hoistedOptions"])) {
                            if (interaction.options["_hoistedOptions"].length > 1) {
                                log += `${value.name}: ${value.value} | `;
                            } else {
                                log += `${value.name}: ${value.value}`;
                            }
                        }
                        //discordCommandLog(interaction.user.id, interaction.commandName, log);
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    try {
                        // if (interaction.member.permissions.has(cmd.userPermissions || [])) {
                        getUserPerms(interaction.user.id).then(perms => {
                            if (PERMS[interaction.commandName]) {
                                if (perms & PERMS[interaction.commandName]) {
                                    cmd.execute(client, interaction, options);
                                } else {
                                    return interaction.reply({ content: "Du har ikke adgang til at bruge den her command.", ephemeral: true });
                                }
                            } else {
                                cmd.execute(client, interaction, options);
                            }
                        })
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }
}