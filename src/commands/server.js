const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Provides information about the server."),
	async execute(interaction) {
		// const guild = interaction.member.guild.id;
		console.log(interaction.member.guild.members.cache);
		await interaction.reply({
			content: `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
			emphermal: true,
		});
	},
};
