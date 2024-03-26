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
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );
    } catch (error) {
        console.log(`error: ${error}`);
    }
})();