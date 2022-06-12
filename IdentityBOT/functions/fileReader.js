const fs = require('fs');

module.exports = {
    readDir: function(dir) {
        let returnarray = [];

        function search(dir) {
            fs.readdirSync(dir).forEach(f => {
                if (fs.statSync(dir + "/" + f).isDirectory()) {
                    search(dir + "/" + f)
                } else {
                    returnarray.push(dir + "/" + f)
                }
            })
        }
        search(dir)
        return returnarray
    }
}