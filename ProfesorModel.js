const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Komentar = require('./KomentarModel');
const Skola = require('./SkolaModel');

const Profesor = new Schema({
	_id: ObjectId,
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
	komentari: [Komentar],
	skole: [Skola]
});

module.exports = Profesor;
