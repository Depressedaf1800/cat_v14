require('dotenv').config();
const keep_alive = require("../keep_alive.js");

const { Client, IntentsBitField } = require('discord.js');

const cat = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

const cat_variations = ["cat", "kitty", "catto", "kitten"];
const sad_variations = [":(", "😔", "😟", "☹️", "🥺", "🥹", "😢", "😭", "😞", "sad", "cry", ":'("]
const dive_outcomes = ["🐋","🦈","🐬","🦭","🦞","🦆","🦀","🦑","🦐","🐠","🐟"];
const dive_weights = [1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1];

cat.on('ready', (c) => {
    console.log(`${c.user.username} am online nya`);
});

cat.on('messageCreate', (message) => {
    if(message.author.bot) return;

    if (cat_variations.some(variation => 
        message.content.toLowerCase().includes(variation))){
        message.channel.send("nya");
    }

    if (sad_variations.some(variation => 
        message.content.toLowerCase().includes(variation))){
        message.channel.send("😭");
    }
});

cat.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName == "ping"){
        interaction.reply("pong");
    }
    
    if(interaction.commandName == "dive"){
        interaction.reply(`I caught this ${
            weighted_random(dive_outcomes, dive_weights)
        } nya!`);
    }

})

cat.login(process.env.TOKEN);

function weighted_random(items, weights) {
    var i;

    for (i = 1; i < weights.length; i++)
        weights[i] += weights[i - 1];
    
    var random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    
    return items[i];
}