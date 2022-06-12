var con = require('../backend/database');

exports.remVehicle = async function (plate) {
    con.query(`DELETE FROM owned_vehicles WHERE plate = ?`, [plate], function (err, result) {
        if (err) throw err;
    });
}
exports.updateVehicle = async function (oldplate, newplate) {
    con.query(`UPDATE owned_vehicles SET plate = ? WHERE plate = ?`, [newplate, oldplate], function (err, result) {
        if (err) throw err;
    });
}