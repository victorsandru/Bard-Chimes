module.exports = {
	name: "stateChange",
	execute(oldState, newState) {
		console.log(
			`Connection transitioned from ${oldState.status} to ${newState.status}`
		);
	},
};
