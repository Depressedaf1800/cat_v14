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

const test_commands = [
    {
        name: 'add',
        description: 'returns the addition of two values'
    }
]

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

(async () => {
    try {
        console.log("registering test slash commands");
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
                
            ),
            { body: test_commands }
        );
        console.log("test slash commands registered successfully");
    } catch (error) {
        console.log(`error: ${error}`);
    }
})();