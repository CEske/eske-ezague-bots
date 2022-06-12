module.exports = {
    eventName: 'guildMemberAdd',
    disabled: false,
    type: "on",
    run: async (client, options, member) => {
        const { config, con } = options;
        con.query(`SELECT * FROM players WHERE id = ?`, [member.id], (error, rows) => {
            if(rows.length < 1){
                con.query(`INSERT INTO players (id, firstjoin, lastjoin) VALUES(?, ?, ?)`, [member.id, Date.now(), Date.now()]);
            } else {
                con.query(`UPDATE players SET lastjoin = ? WHERE id = ?`, [Date.now(), member.id]);
            }
        })
    }
}