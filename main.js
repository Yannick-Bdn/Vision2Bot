const fs = require("fs");
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const config = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands'); //récupère le folder 'commands'
const commandFolders = fs.readdirSync(foldersPath);//retourne le contenu de foldersPath

for (const folder of commandFolders) { //récupère le folder courant de la liste de foldersPath
	const commandsPath = path.join(foldersPath, folder);//concatène foldersPath et folder
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); //récupère l'ensemble des js contenus dans commandPath
	for (const file of commandFiles) { //récupère le fichier courant de commandFiles
		const filePath = path.join(commandsPath, file); //concath le path et le nom du fichier
		const command = require(filePath); 
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[ATTENTION] La commande ${filePath} est manquante est nécessite la/les propriétés "data" et/ou "execute".`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`Commande ${interaction.commandName} incomprise.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: "Erreur 1 lors de l\'execution de la commande.", ephemeral: true });
		} else {
			await interaction.reply({ content: "Erreur 2 lors de l\'execution de la commande.", ephemeral: true });
		}
	}
});

client.on("ready", () => {
    console.log(`Bonsoir Capichef, ${client.user.tag} est prêt à niquer des cartes mères !`);
});

client.login(config.bot_token);


/*
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }

    if (interaction.commandName === "rankup") {
        var role = interaction.member.guild.roles.cache.find(role => role.id === config.rankup);
        try {
            interaction.member.roles.add(role)
            interaction.reply(`Role ${role.name} ajouté avec succès !`)

        } catch (e) {
            interaction.reply(`Non bâtard, tu mérites pas le role ${role.name}`)
            console.error(e)
        };
    }


});*/

