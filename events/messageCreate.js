const { Events } = require("discord.js");
const {cat_variations, sad_variations} = require("../globalValues.json");

module.exports = {
    name: Events.MessageCreate,
    execute(message){
        if(message.author.bot) return;

        if ((cat_variations.some(variation => 
            message.content.toLowerCase().includes(variation))) ||
            (message.mentions.has(cat.user.id))){
            message.channel.send("nya");
        }

        if (sad_variations.some(variation => 
            message.content.toLowerCase().includes(variation))){
            message.channel.send("😭");
        }
    }
};