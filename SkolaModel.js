const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Skola = new Schema({
	ime: {
		type: String,
		required: true
	},
	predmeti: [String]
});

module.exports = Skola;
