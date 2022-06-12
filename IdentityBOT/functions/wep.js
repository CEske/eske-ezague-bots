var con = require('../backend/database');

exports.remWeptint = async function (steam) {
    if (!steam) return;
    con.query(`DELETE FROM id_weptint WHERE steam = ?`, [steam], function (err, result) {
        if (err) throw err;
    });
}
exports.giveWeptint = async function (steam) {
    if (!steam) return;
    con.query(`SELECT * FROM id_weptint WHERE identifier = ?`, [steam], function (err, result) {
        if (err) throw err;
        if (result.length < 1) return;
        con.query(`INSERT INTO steam (?)`, [steam], function (err, result) {
            if (err) throw err;
        });
    });
}