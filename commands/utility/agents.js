const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function camelize(str) {
    if(str ==null)return str;
    return str.charAt(0).toUpperCase()+str.substring(1).toLowerCase();
  }
function rearrange(str){
    str = camelize(str);
    if (str=="Initiator") return "Initiateur";
    if (str=="Sentinel") return "Sentinelle";
    return str;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("agents")
        .setDescription("Return all the agents if there is no args!")
        .addStringOption(option =>
            option.setName("agent")
                .setDescription("The agent name")
                .setRequired(false))
        .addStringOption(option =>
            option.setName("role")
                .setDescription("The role name")
                .setRequired(false)
                .addChoices(
					{ name: 'Contrôleur', value: 'Contrôleur' },
					{ name: 'Duelliste', value: 'Duelliste' },
					{ name: 'Initiateur', value: 'Initiateur' },
					{ name: 'Sentinelle', value: 'Sentinelle' },
				),
        
        ),
    async execute(interaction) {
        const agentInput = camelize(interaction.options.getString("agent"));
        const roleInput = camelize(interaction.options.getString("role"));
        const channel = interaction.channel;

        interaction.reply(`Voici ce que tu m'as demandé :`);
        fetch(`https://playvalorant.com/page-data/fr-fr/agents/Jett/page-data.json`)
            .then(response => response.json())
            .then(json => json.result.data.allContentstackAgentList.nodes.forEach(
                node => {
                    if (node.title === "AGENTS") {
                        node.agent_list.forEach(agentCourrant => {
                            if (agentInput == null && roleInput == null) {
                                const embed = new EmbedBuilder();
                                embed.setAuthor({
                                    name: "↪ Valorant API Officielle",
                                    url: `https://playvalorant.com/page-data/fr-fr/agents/${agentCourrant.title}/page-data.json`,
                                    iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                                });
                                embed.setTitle(`${agentCourrant.title} - ${camelize(rearrange(agentCourrant.role))}`);
                                embed.setURL(`https://playvalorant.com/fr-fr/agents/${agentCourrant.title}/`);
                                embed.setDescription(`__**Biographie**__ : ${agentCourrant.description} \n`);
                                embed.setThumbnail(`${agentCourrant.agent_image.url}`);
                                channel.send({ embeds: [embed] });
                            }
                            if (camelize(agentCourrant.title) == agentInput) {
                                const embed = new EmbedBuilder();
                                embed.setAuthor({
                                    name: "↪ Valorant API",
                                    url: "https://valorant-api.com/v1/agents",
                                    iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                                });
                                embed.setTitle(`${agentCourrant.title} - ${camelize(rearrange(agentCourrant.role))}`);
                                embed.setURL(`https://playvalorant.com/fr-fr/agents/${agentCourrant.title}`);
                                embed.setDescription(`__**Biographie**__ : ${agentCourrant.description}`);
                                embed.setThumbnail(`${agentCourrant.agent_image.url}`);
                                channel.send({ embeds: [embed] })

                                agentCourrant.abilities.forEach(abilitie => {

                                    const embed = new EmbedBuilder()
                                    embed.setAuthor({
                                        name: "↪ Valorant API",
                                        url: "https://valorant-api.com/v1/agents",
                                        iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                                    })
                                    embed.setTitle(`${abilitie.ability_name.substring(4)}`)
                                    embed.setURL(`${abilitie.ability_video[0].video.file.url}`);
                                    embed.setDescription(`${abilitie.ability_description}`)
                                    embed.setThumbnail(`${abilitie.ability_icon.url}`);

                                    channel.send({ embeds: [embed] })
                                })
                            }
                            if (rearrange(agentCourrant.role) == roleInput) {
                                const embed = new EmbedBuilder();
                                embed.setAuthor({
                                    name: "↪ Valorant API Officielle",
                                    url: `https://playvalorant.com/page-data/fr-fr/agents/${camelize(agentCourrant.title)}/page-data.json`,
                                    iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                                });
                                embed.setTitle(`${agentCourrant.title} - ${camelize(rearrange(agentCourrant.role))}`);
                                embed.setURL(`https://playvalorant.com/fr-fr/agents/${agentCourrant.title}/`);
                                embed.setDescription(`__**Biographie**__ : ${agentCourrant.description} \n`);
                                embed.setThumbnail(`${agentCourrant.agent_image.url}`);
                                channel.send({ embeds: [embed] });
                            }
                        }
                        )
                    }
                }
            )
            )
    }
}

/*
        fetch(`https://valorant-api.com/v1/agents`)
            .then(response => response.json())
            .then(json => {
                json.data.forEach(agentCourrant => {
                    if (agentCourrant.isPlayableCharacter) {
                        if (agentInput == null && roleInput == null) {

                            const embed = new EmbedBuilder();
                            embed.setAuthor({
                                name: "↪ Valorant API",
                                url: "https://valorant-api.com/v1/agents",
                                iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                            });
                            embed.setTitle(`${agentCourrant.displayName} (${agentCourrant.developerName}) -  ${rearrange(agentCourrant.role).displayName}`);
                            embed.setURL(`${agentCourrant.fullPortrait}`);
                            embed.setDescription(`__**Description**__ : ${agentCourrant.description} \n`);
                            embed.setThumbnail(`${agentCourrant.displayIcon}`);

                            channel.send({ embeds: [embed] });
                        }
                        if (agentCourrant.displayName == agentInput) {
                            const embed = new EmbedBuilder();
                            embed.setAuthor({
                                name: "↪ Valorant API",
                                url: "https://valorant-api.com/v1/agents",
                                iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                            });
                            embed.setTitle(`${agentCourrant.displayName} (${agentCourrant.developerName}) -  ${rearrange(agentCourrant.role).displayName}`);
                            embed.setURL(`${agentCourrant.fullPortrait}`);
                            embed.setDescription(`__**Description**__ : ${agentCourrant.description} \n__**Role**__ : \n ${rearrange(agentCourrant.role).description}`);
                            embed.setThumbnail(`${agentCourrant.displayIcon}`);
                            channel.send({ embeds: [embed] })

                            agentCourrant.abilities.forEach(abilitie => {

                                const embed = new EmbedBuilder()
                                embed.setAuthor({
                                    name: "↪ Valorant API",
                                    url: "https://valorant-api.com/v1/agents",
                                    iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                                })
                                embed.setTitle(`${abilitie.slot} - ${abilitie.displayName}`)
                                embed.setDescription(`${abilitie.description}`)
                                embed.setThumbnail(`${abilitie.displayIcon}`);

                                channel.send({ embeds: [embed] })

                            })



                        }
                        if (rearrange(agentCourrant.role).displayName == roleInput) {
                            if(first){
                                const embed = new EmbedBuilder();
                                embed.setAuthor({
                                    name: "↪ Valorant API",
                                    url: "https://valorant-api.com/v1/agents",
                                    iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                                });
                                embed.setTitle(`${rearrange(agentCourrant.role).displayName}`);
                                embed.setURL(`${agentCourrant.fullPortrait}`);
                                embed.setDescription(`__**Description**__ : ${agentCourrant.description} \n__**Role**__ : \n ${rearrange(agentCourrant.role).description}`);
                                embed.setThumbnail(`${agentCourrant.displayIcon}`);
    
                                channel.send({ embeds: [embed] });
                            }

                            const embed = new EmbedBuilder();
                            embed.setAuthor({
                                name: "↪ Valorant API",
                                url: "https://valorant-api.com/v1/agents",
                                iconURL: "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png",
                            });
                            embed.setTitle(`${agentCourrant.displayName} (${agentCourrant.developerName}) -  ${rearrange(agentCourrant.role).displayName}`);
                            embed.setURL(`${agentCourrant.fullPortrait}`);
                            embed.setDescription(`__**Description**__ : ${agentCourrant.description} \n__**Role**__ : \n ${rearrange(agentCourrant.role).description}`);
                            embed.setThumbnail(`${agentCourrant.displayIcon}`);

                            channel.send({ embeds: [embed] });
                        }
                    }
                })
            })
    */
