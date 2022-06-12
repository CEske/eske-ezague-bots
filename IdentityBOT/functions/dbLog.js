var con = require('../backend/database');

module.exports = {
    discordCommandLog: function(id, command, json) {
        if (!id || !json || !command) return;

        con.query(`INSERT INTO discordcommands (id, command, json) VALUES(?, ?, ?)`, [id, command, json], (err, row) => {
            if (err) throw err;
        });
    },
};
