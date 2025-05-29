const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Access to all Admin Commands")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("hi")
                .setDescription("Allows cat to talk to you")
                
        ),
    async execute(interaction){
        await interaction.deferReply();
        const adminSubCommand = interaction.options.getSubcommand();

        if(adminSubCommand === "hi"){
            await interaction.editReply("hello nya");
        }
    }
};