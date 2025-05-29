const { SlashCommandBuilder, ButtonStyle } = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const profileModel = require("../models/profileSchema");
const {dive_outcomes, dive_prices} = require("../globalValues.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Sell your goodies to Cat"),


    async execute(interaction, profileData){
        const { id } = interaction.user;
        const { inventory } = profileData;
        let selectedFish = {};
        const quantity = (f) => (inventory.get(f) || 0) - (selectedFish[f] || 0);

        const shopEmbed = new EmbedBuilder()
            .setTitle("Cat's Shop")
            .setDescription("Welcome to Cat's Shop! You can sell your goodies here.");

        await interaction.deferReply();
        
        function generateRows(){
            const buttons = dive_outcomes.map((fish) => {
                return new ButtonBuilder()
                    .setCustomId(fish)
                    .setLabel(`${fish} (${quantity(fish)})`)
                    .setStyle(ButtonStyle.Primary);
            });
            
            let rows = [];
            for (let i = 0; i < buttons.length; i += 5) {
                const row = new ActionRowBuilder()
                    .addComponents(buttons.slice(i, i + 5));
                rows.push(row);
            }
        
            let totalSum = 0;
            for (const f in selectedFish) {
                totalSum += selectedFish[f] * dive_prices[dive_outcomes.indexOf(f)];
            }
        
            rows.push(
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_sale')
                        .setLabel(`Confirm Sale $${totalSum}`)
                        .setStyle(ButtonStyle.Success),
                )
            );
        
            return rows;
        }
    
        await interaction.editReply({ embeds: [shopEmbed], components: generateRows() });

        const message = await interaction.fetchReply();

        const filter = (i) => i.user.id === id;

        const collector = message.createMessageComponentCollector({
            filter,
            time: 300000
        });

        collector.on("collect", async (i) => {
            if(i.customId === "confirm_sale"){
                try{
                    let totalSum = 0;
                    for(const f in selectedFish){
                        totalSum += selectedFish[f] * dive_prices[dive_outcomes.indexOf(f)];
                    }
                    
                    const update = {
                        $inc: {
                            balance: totalSum
                        }
                    };
                    
                    for(const f in selectedFish){
                        update.$inc[`inventory.${f}`] = -selectedFish[f];
                    }
                    
                    await profileModel.findOneAndUpdate({ userId: id }, update);
                    await i.update({ content: `You have sold your goodies for $${totalSum} nya!`, embeds: [], components: [] });
                } catch(err){
                    await i.update({ content: `There was a problem with the bank nya`, embeds: [], components: [] });
                    console.log(err);
                }
            }else{

                const fish = i.customId;
                if(quantity(fish) > 0){
                    // Update selected fish
                    if (!selectedFish[fish]) {
                        selectedFish[fish] = 0;
                    }
                    selectedFish[fish]++;

                    shopEmbed.setFooter(null);
                    await i.update({ embeds: [shopEmbed], components: generateRows() });

                }else{
                    shopEmbed.setFooter({ text: `No more ${fish} nya` });
                    await i.update({ embeds: [shopEmbed], components: generateRows() });
                }
            }
        })

        collector.on("end", async (reason) => {
            console.log(`Collector ended due to ${reason}`);
            if (reason === "time") {
                try {
                    await message.edit({ content: "shop closed due to timeout nya!", embeds: [], components: [] });
                } catch (err) {
                    console.log(err);
                }
            }
        });
    },
};

