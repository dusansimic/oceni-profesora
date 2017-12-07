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
	srednjaOcena: {
		type: Number,
		min: 1.0,
		max: 5.0
	},
	ocene: {
		type: [Number]
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
		vreme: {
			type: Date,
			required: true
		},
		likes: {
			type: Number,
			required: true,
			min: 0
		},
		dislikes: {
			type: Number,
			required: true,
			min: 0
		}
	}],
	skole: [{
		ime: {
			type: String,
			required: true
		},
		predmeti: {
			type: [String],
			required: true
		}
	}]
}, {collection: 'teacher'});

module.exports = mongoose.model('Profesor', Profesor);
