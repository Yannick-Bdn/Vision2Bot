const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config.json");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("rankup")
		.setDescription("Rankup le membre"),
	async execute(interaction) {
		var role = interaction.member.guild.roles.cache.find(role => role.id === config.rankup);
        try {
            if(interaction.member.roles.cache.has(role.id)){
            interaction.member.roles.remove(role)
            interaction.reply(`Role ${role.name} retiré avec succès !`)
        }
            else if(!interaction.member.roles.cache.has(role.id)){
            interaction.member.roles.add(role)
            interaction.reply(`Role ${role.name} ajouté avec succès !`)
        }
        } catch (e) {
            interaction.reply(`Non bâtard, le ${role.name} ça marche pas comme ça`)
            console.error(e)
        };
	},
};