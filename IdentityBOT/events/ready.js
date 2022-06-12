module.exports = {
    eventName: 'ready',
    disabled: false,
    type: "once",
    run: async (client, options) => {
        const { config, con, fs } = options;

        const guild = await client.guilds.fetch('938062600149794856')

        guild.commands.set(client.slashcommandData).then(commands => {
            const fullPermissions = [];

            commands.forEach(cmd => {
                fullPermissions.push({
                    id: cmd.id,
                    permissions: client.slashcommands.get(cmd.name).permissions ?? []
                })
            })

            guild.commands.permissions.set({ fullPermissions: fullPermissions })
        })

        console.log('ready');
    }
}