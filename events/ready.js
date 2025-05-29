const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once : true,
    execute(cat){
        console.log(`${cat.user.username} am online nya!`);
    }
};