const fetch = require("node-fetch");

const skillsEmbedTemplate = {
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
			name: "Description: ",
			value: "",
		},
		{
			name: "Uses ",
			value: "",
		},
		{
			name: "Cost:",
			value: "",
		},
		{
			name: "Cooldowns:",
			value: "",
		},
	],
	timestamp: new Date().toISOString(),
	footer: {
		text: "Click a button to learn more about their specific skill",
	},
};

const passiveEmbedTemplate = {
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
			name: "Description: ",
			value: "",
		},
		{
			name: "",
			value: "",
		},
	],
	timestamp: new Date().toISOString(),
	footer: {
		text: "Click a button to learn more about their specific skill",
	},
};

const skillKeyMap = {
	4: "Passive",
	0: "Q",
	1: "W",
	2: "E",
	3: "R",
};

const fillEmbed = (championObj, id) => {
	if (id == 4) {
		passiveEmbedTemplate.image.url = `http://ddragon.leagueoflegends.com/cdn/13.6.1/img/passive/${championObj.id}_P.png`;
		passiveEmbedTemplate.thumbnail.url = `http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${championObj.id}.png`;
		passiveEmbedTemplate.description =
			skillKeyMap[id] + ` - ${championObj.passive.name}`;
		passiveEmbedTemplate.fields[0].value =
			championObj.passive.description.replace(/<[^>]+>/g, "");
		passiveEmbedTemplate.fields[1].name = "Uses " + championObj.partype;
		passiveEmbedTemplate.title = championObj.name;

		return passiveEmbedTemplate;
	} else {
		skillsEmbedTemplate.image.url = `http://ddragon.leagueoflegends.com/cdn/13.6.1/img/spell/${championObj.spells[id].image.full}`;
		skillsEmbedTemplate.description =
			skillKeyMap[id] + ` - ${championObj.spells[id].name}`;
		skillsEmbedTemplate.thumbnail.url = `http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${championObj.id}.png`;
		skillsEmbedTemplate.title = championObj.name;
		skillsEmbedTemplate.fields[0].value = championObj.spells[
			id
		].description.replace(/<[^>]+>/g, "");
		skillsEmbedTemplate.fields[1].name = "Uses " + championObj.partype;
		skillsEmbedTemplate.fields[3].value = championObj.spells[id].cooldown
			.toString()
			.replace(/,/g, " \\ ");
		skillsEmbedTemplate.fields[2].value = championObj.spells[id].cost
			.toString()
			.replace(/,/g, " \\ ");

		return skillsEmbedTemplate;
	}
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

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		if (!interaction.isButton() || !interaction.customId.includes("skill"))
			return;
		const nameId = interaction.customId.split("skill"); // returns [champName, id]
		const champObj = await getChampionJson(nameId[0]);
		const embed = await fillEmbed(
			champObj.data[nameId[0]],
			parseInt(nameId[1])
		);
		await interaction.update({
			embeds: [embed],
			components: interaction.components,
		});
	},
};
