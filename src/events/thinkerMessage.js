const thinkerEmbed = {
	color: 0x0099ff,
	title: "Bro really thinks he's the thinker :skull: :skull:",
	url: "https://youtube.com/shorts/C2aDEMbVpBc?feature=share",
	image: {
		url: "https://media.tenor.com/kOJnwQX83BQAAAAd/bro-thinks-hes-the-thinker-bro-thinking.gif",
	},
};

module.exports = {
	name: "messageCreate",
	execute(msg) {
		const think =
			msg.content.includes("thinker") ||
			msg.content.includes("think") ||
			msg.content.includes("thinking") ||
			msg.content.includes("thinks") ||
			msg.content.includes("thought") ||
			msg.content.includes("hm");
		if (think) {
			msg.reply({ embeds: [thinkerEmbed] });
		}
	},
};
