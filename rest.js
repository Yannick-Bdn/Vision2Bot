const config = require("./config.json");
const { REST, Routes } = require('discord.js');
const { bot_id, server_id, bot_token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const rest = new REST({ version: "10" }).setToken(config.bot_token);
const foldersPath = path.join(__dirname, 'commands'); //récupère le folder 'commands'
const commandFolders = fs.readdirSync(foldersPath);//retourne le contenu de foldersPath

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		console.log(commands);
    console.log(Routes.applicationCommands(bot_id));
    const data = await rest.put(
			Routes.applicationCommands(bot_id),
			{ body: commands },
		);


		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();