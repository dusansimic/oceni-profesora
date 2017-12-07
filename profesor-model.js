import { Collection } from 'mongoose';

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
		required: true,
		min: 1.0,
		max: 5.0
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
		predmeti: [String]
	}]
}, {collection: 'teacher'});

Profesor.pre('save', next => {
	let srednjaOcena = 0;

	for (let i = 0; i < this.komentari.length; i++) {
		srednjaOcena += this.komentari[i].ocena;
	}

	srednjaOcena /= this.komentari.length;

	this.srednjaOcena = srednjaOcena;

	next();
});

module.exports = mongoose.model('Profesor', Profesor);
