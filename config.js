module.exports = {
	serverUrl: () => {
		return process.env.SERVER_URL || 'mongodb://localhost:27017/oceniprof';
	},
	superSecret: 'df4211bd13dd70af972dcf2f0b05856c6c0815d61fe123a179311a12e200c230'
};
