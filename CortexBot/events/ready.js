module.exports = {
    eventName: 'ready',
    disabled: false,
    type: "once",
    run: async (client, options) => {
        const { config, con, fs } = options;

        (await client.guilds.fetch("853667312342925362")).commands.set(client.slashcommandData);

        const statusArray = [
            'Eske',
            'Lausten',
            'Legacy',
            'Lochy',
            'Magi',
            'Momse',
            'NamZ',
            'SwupDK',
            'Synix',
            'ZnowY',
            'Ezague',
            'V1NDs'
        ]

        console.log(`Logged ind som ${client.user.tag}!`);
        setInterval(() => {
            client.user.setPresence({ activities: [{ name: statusArray[Math.floor(Math.random() * statusArray.length)], type: 'WATCHING' }] });
        }, 5000);

        setInterval(function () {
            fs.readFile('./backend/mute.json', "utf8", (err, content) => {
                if (err) throw err;
                if (!content) return;
                let json = JSON.parse(content);
                for (const key of Object.keys(json.spillere)) {
                    if (!key) return;
                    const tidNu = Date.now();
                    const tidMute = json.spillere[key]["expire"];
                    const expire = tidMute - tidNu;
                    if (expire <= 1) {
                        Reflect.deleteProperty(json.spillere, [key]);
                        json = JSON.stringify(json);
                        fs.writeFile('./backend/mute.json', json, err => {
                            if (err) throw err;
                        });
                        client.guilds.cache.get('853667312342925362').members.fetch(key).then(member => {
                            member.roles.remove('892689774660419665');
                        });
                    }
                }
            });
        }, 10000);
    }
}