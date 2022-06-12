var con = require('../backend/database');
var fs = require('fs');

exports.givMute = async function (discordid, kanal, tid, grund) {
    if (!discordid || !kanal || !tid || !grund) return;
    fs.readFile('../json/mute.json', 'utf8', function (err, data) {
        if (err) throw err;
        let json = JSON.parse(data);
        let muteExpire = Date.now() + tid;
        let nytMute = {[discordid]: {expire: muteExpire,reason: grund}};
        if (kanal === 'hygge') {
            Object.assign(json.hygge, nytMute);
        } else {
            Object.assign(json.andet, nytMute);
        }
        json = JSON.stringify(json);
        fs.writeFile('../json/mute.json', json, function (err) {
            if (err) throw err;
        });
    });
}

exports.updateVehicle = async function (discordid, kanal) {
    if (!discordid || !kanal) return;
    if (kanal === 'hygge') {
        Reflect.deleteProperty(json.hygge, [discordid]);
    } else {
        Reflect.defineProperty(json.andet, [discordid]);
    }
}