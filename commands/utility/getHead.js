const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("gethead")
		.setDescription("Return minecraft head of a player in arg!")
        .addStringOption(option =>
            option.setName("pseudo")
                .setDescription("The player pseudo")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("pixel")
                .setDescription("The size of the head")
                .setRequired(false)),
	async execute(interaction) {
        const pseudo = interaction.options.getString("pseudo");
        const channel = interaction.channel;
        let pixel = interaction.options.getString("pixel") || 50;
        let comment = "";
        if(pixel>300){
            pixel=300;
            comment="Vu que tu as la folie des grandeurs, on va se limiter à 300 pixels si tu veux bien..... "
        }else if(pixel<50){
            pixel=50;
            comment="T'es un minimoys ouuuu ?? J'ai aggrandit la tête pour qu'elle atteigne 50px...... "
        }
        interaction.reply(`${comment}Voici la tête de ${pseudo} :`);
        await channel.send(`https://mc-heads.net/avatar/${pseudo}/${pixel}`);
	},
};