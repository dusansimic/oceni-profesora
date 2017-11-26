const express = require('express');
const mongoose = require('mongoose');

const api = express.Router();

const ServerUrl = process.env.SERVER_URL || 'mongodb://localhost:27017/oceniprof';

const Profesor = mongoose.model('Profesor', require('./profesor-model'));

api.get('/', (req, res) => {
	return res.send('Api is up and running!');
});

api.get('/motd', (req, res) => {
	return res.send({motd: 'Hello world!'});
});

api.get('/getProfesori', (req, res) => {
	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.find({}, (err, docs) => {
		if (err) {
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		return res.send(docs);
	});
});

api.post('/queryProfesori', (req, res) => {
	const profData = req.body;

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.find(profData, (err, docs) => {
		if (err) {
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		return res.send(docs);
	});
});

api.post('/getKomentari/fromProfesor', (req, res) => {
	const profData = req.body;

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.find(profData, 'komentari', (err, docs) => {
		if (err) {
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		return res.send(docs);
	});
});

api.post('/addProfesor', (req, res) => {
	const profData = req.body;

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.create(profData, (err, docs) => {
		if (err) {
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		return res.send(docs);
	});
});

api.post('/addKomentar', (req, res) => {
	const profData = req.body.prof;
	const komentarData = req.body.komentar;

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.update(profData, {$push: {komentari: komentarData}}, (err, docs) => {
		if (err) {
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		return res.send(docs);
	});
});

module.exports = api;
