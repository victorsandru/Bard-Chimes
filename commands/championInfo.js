const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const getChampion = (champ) => {
	const filePath = path.join(__dirname, "../media", "champion.json");
	const championData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	champ = champ.replace(/[^a-zA-Z]/g, "");
	for (i in championData.data) {
		if (champ.toLowerCase() === championData.data[i].id.toLowerCase()) {
			return championData.data[i].id;
		}
	}

	return null;
};

const getChampionJson = (champ) => {
	const url = `http://ddragon.leagueoflegends.com/cdn/13.6.1/data/en_US/champion/${champ}.json`;
	const info = fetch(url)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error("Network response was not ok.");
		})
		.catch((error) => {
			console.error(
				"There was a problem with the fetch operation:",
				error
			);
		});
	return info;
};

const championEmbed = {
	color: 0x0099ff,
	title: "",
	thumbnail: {
		url: "",
	},
	description: "",
	image: {
		url: "",
	},
	fields: [
		{
			name: "Tips:",
			value: "",
		},
		{
			name: "Lore:",
			value: "",
		},
	],
	timestamp: new Date().toISOString(),
	footer: {
		text: "Click a button to learn more about their specific skill",
	},
};

const skillButtons = (champName) => {
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(`${champName}skill4`)
			.setLabel("Passive")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId(`${champName}skill0`)
			.setLabel("Q")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId(`${champName}skill1`)
			.setLabel("W")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId(`${champName}skill2`)
			.setLabel("E")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId(`${champName}skill3`)
			.setLabel("R")
			.setStyle(ButtonStyle.Primary)
	);

	return row;
};

const fillEmbed = (championObj) => {
	const imageURL = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championObj.id}_0.jpg`;
	const thumbnailURL = `http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${championObj.id}.png`;
	championEmbed.title = championObj.name;
	championEmbed.thumbnail.url = thumbnailURL;
	championEmbed.image.url = imageURL;
	championEmbed.description = championObj.title;
	championEmbed.fields[0].value = "";
	for (i in championObj.allytips) {
		championEmbed.fields[0].value += `\n- ${championObj.allytips[i]}\n`;
	}
	championEmbed.fields[1].value = championObj.lore;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("championinfo")
		.setDescription("Displays info about selected champion")
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("Champion name to get info about")
				.setRequired(true)
		),
	async execute(interaction) {
		const champion = interaction.options.getString("name");
		const champName = await getChampion(champion);
		if (champName === null) {
			await interaction.reply({
				content: "⚠️ Error - cannot find champion ",
				ephemeral: true,
			});
		} else {
			const champJSON = await getChampionJson(champName);
			await fillEmbed(champJSON.data[champName]);
			const buttons = await skillButtons(champName);
			await interaction.reply({
				embeds: [championEmbed],
				components: [buttons],
			});
		}
	},
};
