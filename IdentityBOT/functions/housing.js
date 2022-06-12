var con = require('../backend/database');

module.exports = {

    getInventory: function(husId) {
        console.log(1)
        if (!husId) return;
        let inventory = '';
        con.query(`SELECT inventory FROM housing_v3 WHERE houseId = ?`, [husId], (err, data) => {
            if (err) throw err;
            if (!data[0]) return;
            let inventorydata = JSON.parse(data[0]);
            console.log(inventorydata)
            let weapons = '';
            for(const [key, value] of Object.entries(inventorydata)){
                if(value.length > 0){
                    if(key === "weapons"){
                        for(let x = 0; x<value.length; x++) {
                            weapons += `[${value[x].label}: ${value[x].ammo} (${value[x].weaponId})] `;
                        }
                        inventory += `${key}: ${weapons} `;
                    } else {
                        inventory += `${key}: ${value} `;
                    }
                }
            }
            if (inventory === '') {inventory = 'Tomt';}
            return inventory;
        })
    },

    getCoords: function(husId) {

    },

    getKeys: function(husId) {

    }
}