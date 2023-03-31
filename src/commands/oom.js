const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("oom")
		.setDescription("Out of mana!"),
	async execute(interaction) {
		// const guilds =
	},
};
