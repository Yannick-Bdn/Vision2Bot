const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function camelize(str) {
    if (str == null) return str;
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}
function rearrange(str) {
    str = camelize(str);
    return str;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("arsenal")
        .setDescription("Return all the arsenal if there is no args!")
        .addStringOption(option =>
            option.setName("type")
                .setDescription("The type name")
                .setRequired(false)
                .addChoices(
                    { name: 'Armes de poing', value: 'sidearms' },
                    { name: 'Sidearms', value: 'sidearms' },
                    { name: 'Melee', value: 'melee' },
                    { name: 'Mêlée', value: 'melee' },
                    { name: 'Pistolets Mitrailleurs', value: 'smgs' },
                    { name: 'Smgs', value: 'smgs' },
                    { name: 'Fusils à pompe', value: 'shotguns' },
                    { name: 'Shotguns', value: 'shotguns' },
                    { name: 'Fusils', value: 'rifles' },
                    { name: 'Rifles', value: 'rifles' },
                    { name: 'Snipers', value: 'snipers' },
                    { name: 'Mitrailleuses', value: 'heavies' },
                    { name: 'Heavies', value: 'heavies' },
                ),

        ),
    async execute(interaction) {
        const typeInput = camelize(interaction.options.getString("type"));
        const channel = interaction.channel;

        interaction.reply(`Voici ce que tu m'as demandé :`);
        fetch(`https://playvalorant.com/page-data/fr-fr/arsenal/sidearms/page-data.json`)
            .then(response => response.json())
            .then(json => json.result.data.allContentstackArsenal.nodes.forEach(
                node => {
                    node.weapons_list.weapons.forEach(weapon => {
                        console.log(camelize(weapon.weapon_name) + "-" + rearrange(weapon.weapon_category_machine_name))
                        if (typeInput == null) {
                            const embed = new EmbedBuilder();
                            embed.setAuthor({
                                name: "↪ Valorant API Officielle",
                                url: `https://playvalorant.com/page-data/fr-fr/arsenal/${weapon.weapon_category_machine_name}/page-data.json`,
                                iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                            });
                            embed.setTitle(`${weapon.weapon_name} - ${rearrange(weapon.weapon_category_machine_name)}`);
                            embed.setURL(`https://playvalorant.com/fr-fr/arsenal/`);
                            embed.setDescription(`${weapon.weapon_tagline} \n__**Description**__ : ${weapon.weapon_hover_description} \n`);
                            embed.setThumbnail(`${weapon.weapon_asset.url}`);
                            channel.send({ embeds: [embed] });
                        }
                        if (rearrange(weapon.weapon_category_machine_name) == typeInput) {
                            const embed = new EmbedBuilder();
                            embed.setAuthor({
                                name: "↪ Valorant API Officielle",
                                url: `https://playvalorant.com/page-data/fr-fr/arsenal/${weapon.weapon_category_machine_name}/page-data.json`,
                                iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                            });
                            embed.setTitle(`${weapon.weapon_name} - ${rearrange(weapon.weapon_category_machine_name)}`);
                            embed.setURL(`https://playvalorant.com/fr-fr/arsenal/`);
                            embed.setDescription(`${weapon.weapon_tagline} \n__**Description**__ : ${weapon.weapon_hover_description} \n`);
                            embed.setThumbnail(`${weapon.weapon_asset.url}`);
                            channel.send({ embeds: [embed] });
                        }
                    }
                    )
                }
            )
            )
    }
}