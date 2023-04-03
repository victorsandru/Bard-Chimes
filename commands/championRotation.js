const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const getChampionRotation = () => {
	const url = `https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${process.env.RIOT_API_KEY}`;

	const champions = fetch(url)
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

	return champions;
};

const getChampionNames = (championIds) => {
	const filePath = path.join(__dirname, "../media", "champion.json");
	const championData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	const championNames = new Map();
	for (i in championData.data) {
		if (championIds.includes(parseInt(championData.data[i].key))) {
			if (championData.data[i].id)
				championNames.set(
					championData.data[i].name,
					championData.data[i].tags[0]
				);
		}
	}

	return championNames;
};

const championEmbed = {
	color: 0x0099ff,
	title: "Free Champion Rotation",
	fields: [
		{
			name: "Champion Roles:",
			value: "",
		},
		{
			name: "🥷 Assassins:",
			value: "",
		},
		{
			name: "🥊 Fighter:",
			value: "",
		},
		{
			name: "🧙 Mage:",
			value: "",
		},
		{
			name: "🚑 Support:",
			value: "",
		},
		{
			name: "🔫 Marksman:",
			value: "",
		},
		{
			name: "🧱 Tanks:",
			value: "",
		},

		{
			name: "Type in ```/championinfo (champion name here)``` to learn more!",
			value: "",
			inline: false,
		},
	],
	timestamp: new Date().toISOString(),
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("championrotation")
		.setDescription(
			"Displays current League of Legends free champion rotation"
		),
	async execute(interaction) {
		const championIds = await getChampionRotation();
		const championNames = await getChampionNames(
			championIds.freeChampionIds
		);
		for (let [key, value] of championNames) {
			championEmbed.fields.forEach((e) => {
				if (e.name.includes(value)) {
					e.value += `\n${key}`;
				}
			});
		}
		await interaction.reply({
			embeds: [championEmbed],
		});
	},
};
