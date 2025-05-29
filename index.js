require('dotenv').config();
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const keep_alive = require("./keep_alive.js");

const { Client, IntentsBitField, Partials, Collection } = require('discord.js');

//discord perms
const cat = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages
    ],partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction
    ]
});

//load events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

for(const file of eventFiles){
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once){
        cat.once(event.name, (...args) => event.execute(...args));
    }else{
        cat.on(event.name, (...args) => event.execute(...args));
    }
}

//load commands
cat.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFile = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for(const file of commandFile){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if("data" in command && "execute" in command){
        cat.commands.set(command.data.name, command);
    }else{
        console.log(`Command at ${filePath} is missing required data or execute`);
    }
}

mongoose.connect(process.env.MONGO_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to bank");
}).catch((err) => {
    console.log(err);
});

cat.login(process.env.TOKEN);