const { SlashCommandBuilder } = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");
const {dive_outcomes, dive_weights} = require("../globalValues.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dive")
        .setDescription("Cat dives for a fishy that can be sold for money"),
    async execute(interaction, profileData){
        const { id } = interaction.user;
        const { lastDiveTimestamp, inventory } = profileData;

        const cooldown = 21600000;
        const timeLeft = cooldown - (Date.now() - lastDiveTimestamp);

        if(timeLeft > 0){
            const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
            await interaction.reply({
                content: `I'm tired nya, wait for ${hours} hrs, ${minutes} mins and ${seconds} seconds`,
                flags: 64
            });
            return;
        } else {
            await interaction.deferReply();
        }

        const caughtFish = weighted_random(dive_outcomes, dive_weights);

        try{
            await profileModel.findOneAndUpdate(
                {userId : id},
                {
                    $set: {
                        lastDiveTimestamp: Date.now(),
                    },
                    $inc: {
                        [`inventory.${caughtFish}`]: 1,
                    }
                }
            )
        }catch(err){
            console.log(err);
        };

        await interaction.editReply(`I caught you a ${caughtFish} nya!`);
    },
};

function weighted_random(items, weights) {
    if (items.length !== weights.length) {
        throw new Error("Items and weights arrays must be the same length");
    }

    const cumulativeWeights = [];
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        cumulativeWeights.push(sum);
    }

    const random = Math.random() * sum;
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (random <= cumulativeWeights[i]) {
            return items[i];
        }
    }
}