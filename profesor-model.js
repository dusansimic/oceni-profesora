const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Profesor = new Schema({
	ime: {
		type: String,
		required: true
	},
	prezime: {
		type: String,
		required: true
	},
	jmbg: {
		type: String,
		required: true,
		minlength: 13,
		maxlength: 13
	},
	komentari: [{
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
		},
		vreme: {
			type: Date,
			required: true
		}
	}],
	skole: [{
		ime: {
			type: String,
			required: true
		},
		predmeti: [String]
	}]
});

module.exports = Profesor;
