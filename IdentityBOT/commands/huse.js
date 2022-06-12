const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("huse")
        .setDescription("Se hvilke huse en spiller har")
        .addStringOption(string =>
            string
                .setName("steamhex")
                .setDescription("Steam identifier på spilleren")
                .setRequired(true)
        )
        .addStringOption(string =>
            string
                .setName("type")
                .setDescription("Vælg hvor meget data du vil se")
                .setRequired(true)
                .addChoice("Se al information", "full") // houseid, coords, nøgler, inventory, etc
                .addChoice("Se huse", "huseo") // houseid
                .addChoice("Se huse og nøgler", "husek") // houseid og nøgler
                .addChoice("Se huse og inventory", "husei") // houseid og inventory
        ),
    execute: (client, interaction, options) => {
        const { Discord, con } = options;
        const steamid = interaction.options.getString('steamhex');
        const type = interaction.options.getString('type');
        con.query(`SELECT * FROM housing_v3`, (err, data) => {
            if (err) throw err;
            let embed = new Discord.MessageEmbed()
                .setTitle(`Huse for ${steamid}`)
            let huse = '';
            for(let i = 0; i<data.length; i++) {
                let husdata = JSON.parse(data[i]["ownerInfo"]);
                let inventorydata = JSON.parse(data[i]["inventory"]);
                let weapons = '';
                let inventory = '';
                if (husdata.identifier !== steamid) return;
                switch(type){
                    case "full": // tilføj nøgler, coords
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
                        embed.addField(data[i].houseId, `Inventory: ${inventory}\nNøgler: ${keys}\nCoords: ${coords}`, true);
                        huse += `HouseID: ${data[i].houseId} | Inventory: ${inventory}\n`;
                        break;
                    case "huseo":
                        embed.addField(data[i].houseId, true);
                        huse += `HouseID: ${data[i].houseId}\n`;
                        break;

                    case "husek": // tilføj nøgler, mangler struktur
                        embed.addField(data[i].houseId, keys, true);
                        huse += `HouseID: ${data[i].houseId}\n`;
                        break;

                    case "husei": // tilføj inventory, mangler struktur
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
                        embed.addField(data[i].houseId, `Inventory: ${inventory}`, true);
                        break;

                    default:
                        break;
                    }

            }
        return interaction.reply({ embeds: [embed] });
        })
    }
}