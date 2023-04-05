const { SlashCommandBuilder } = require("discord.js");
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	AudioPlayerStatus,
} = require("@discordjs/voice");
const { join } = require("node:path");
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("oom")
		.setDescription("Out of mana!"),
	async execute(interaction) {
		const usrChannel = interaction.member.voice.channel;
		if (!usrChannel) {
			return interaction.reply({
				content: "User is not connected to voice channel.",
				ephemeral: true,
			});
		}

		const player = createAudioPlayer();
		const resource = createAudioResource(
			join(__dirname, "../media/oom.mp3")
		);
		const connection = joinVoiceChannel({
			channelId: usrChannel.id,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

		player.play(resource);
		connection.subscribe(player);

		player.on(AudioPlayerStatus.Idle, () => {
			connection.destroy();
		});
		return interaction.reply("You have no mana bro :skull:");
	},
};
