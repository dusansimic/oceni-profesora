const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Komentar = new Schema({
	user: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true,
		maxlength: 512
	},
	ocena: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	}
});

module.exports = Komentar;

