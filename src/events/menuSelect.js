module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		if (!interaction.isStringSelectMenu()) return;

		if (interaction.customId === "championSelector") {
			let selected = interaction.values[0];
			console.log(interaction.embeds);
			await interaction.update({
				content: selected,
				components: [],
				embeds: [],
			});
		}
	},
};
