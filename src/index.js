require('dotenv').config();
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

cat.on('ready', (c) => {
    console.log(`${c.user.username} am online nya`);
});

cat.on('messageCreate', (message) => {
    if(message.author.bot) return;
    if (cat_variations.some(variation => 
        message.content.toLowerCase().includes(variation))){
        message.channel.send("nya");
    }
});

cat.login(process.env.TOKEN);