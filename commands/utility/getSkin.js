const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("getskin")
		.setDescription("Return minecraft skin of a player in arg!")
        .addStringOption(option =>
            option.setName("pseudo")
                .setDescription("The player pseudo")
                .setRequired(true)),
	async execute(interaction) {
        const pseudo = interaction.options.getString("pseudo");
        const channel = interaction.channel;
        interaction.reply(`Voici le skin de ${pseudo} :`);
        await channel.send(`https://mc-heads.net/skin/${pseudo}/300`);
	},
};