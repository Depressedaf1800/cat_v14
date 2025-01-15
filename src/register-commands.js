require('dotenv').config();

const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'replies with pong'
    },
    {
        name: 'dive',
        description: 'dives underwater to catch a fishie'
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("registering slash commands");
        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID,
            ),
            { body: commands }
        );
        console.log("slash commands registered successfully");
    } catch (error) {
        console.log(`error: ${error}`);
    }
})();