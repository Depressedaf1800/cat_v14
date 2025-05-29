const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Shows user their balance"),
    async execute(interaction, profileData){
        const { balance } = profileData;
        await interaction.reply(`you have $${balance} nya!`);
    },
};