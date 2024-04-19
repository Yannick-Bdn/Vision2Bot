const { SlashCommandBuilder, EmbedBuilder, APIEmbedField } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("infovote")
        .setDescription("Return minecraft head of a player in arg!")
        .addStringOption(option =>
            option.setName("pseudo")
                .setDescription("The player pseudo")
                .setRequired(true)),
    async execute(interaction) {
        const pseudo = interaction.options.getString("pseudo");
        const listServMC = [
            { title: "Site1 ServeursMinecraft (24h)", nom: "ServeursMinecraft", url: "https://www.serveursminecraft.org/serveur/5336/" },
            { title: "Site2 ListeServeursMinecraft (3h)", nom: "ListeServeursMinecraft", url: "https://www.liste-serveurs-minecraft.org/vote/?idc=201975" },
            { title: "Site3 ServeurPrive (1h30)", nom: "ServeurPrive", url: "https://serveur-prive.net/minecraft/dynastia-survie-semi-rp-1-20-8064/vote" },
            { title: "Site4 ServeurMinecraft (3h)", nom: "ServeurMinecraft", url: "https://serveur-minecraft.com/2532" },
        ];

        const embed = new EmbedBuilder()
                            .setTitle(`Récapitulatif des Votes de ${pseudo}`);
        const fields = [];

        const promises = listServMC.map(servMC => {
            return fetch(`https://voteapi.dynastia.fr/vote/hasVoted/${servMC.nom}/${pseudo}`)
                .then(response => response.json())
                .then(json => {
                    let msg = null;
                    const timeleft = json.timeBeforeNextVote;

                    if (timeleft == 0) {
                        msg = `Fonce voter sur [${servMC.nom}](${servMC.url}) !!`;
                    } else {
                        const seconds = timeleft % 60;
                        const minutes = ((timeleft % 3600) - seconds) / 60;
                        const hours = (timeleft - (timeleft % 3600)) / 3600;

                        msg = `[${servMC.nom}](${servMC.url}) ${hours}h${minutes}m${seconds}s`;
                    }

                    const newField = { name: `${servMC.title}`, value: `${msg}` };
                    fields.push(newField);
                    return newField;
                });
        });

        Promise.all(promises)
            .then(async results => {
                embed.addFields(results);
                await interaction.reply({ embeds: [embed] });
            }).catch(error => {
                console.error(error);
            });
    }
}