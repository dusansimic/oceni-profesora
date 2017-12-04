const express = require('express');
const mongoose = require('mongoose');

const api = express.Router();

const ServerUrl = process.env.SERVER_URL || 'mongodb://localhost:27017/oceniprof';

const Profesor = require('./profesor-model');

api.get('/', (req, res) => {
	return res.send('Api is up and running!');
});

api.get('/queryProfesori', (req, res, next) => {
	const profData = {};
	if (req.query.jmbg) {
		profData.jmbg = req.query.jmbg;
	}
	if (req.query.ime) {
		profData.ime = req.query.ime;
	}
	if (req.query.prezime) {
		profData.prezime = req.query.prezime;
	}

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.find(profData, (err, docs) => {
		if (err) {
			return next(err);
		}

		return res.send(docs);
	});
});

api.get('/getKomentari/fromProfesor/:id', (req, res, next) => {
	const profData = {jmbg: req.params.id};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.find(profData, 'komentari', (err, docs) => {
		if (err) {
			return next(err);
		}

		return res.send(docs);
	});
});

api.post('/addProfesor', (req, res, next) => {
	const profData = req.body;

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.create(profData, (err, docs) => {
		if (err) {
			return next(err);
		}

		return res.send(docs);
	});
});

api.put('/addKomentar/:id', (req, res, next) => {
	const profData = {jmbg: req.body.id};
	const komentarData = req.body;

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.update(profData, {$push: {komentari: komentarData}}, (err, docs) => {
		if (err) {
			return next(err);
		}

		return res.send(docs);
	});
});

api.put('/likeKomentar/:idProfesora/:idKomentara', (req, res, next) => {
	const idProfesora = req.params.idProfesora;
	const idKomentara = req.params.idKomentara;
	const profData = {jmbg: idProfesora, komentari: {$elemMatch: {_id: idKomentara}}};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.update(profData, {$inc: {'komentari.$.likes': +1}}, (err, docs) => {
		if (err) {
			return next(err);
		}

		return res.send(docs);
	});
});

api.put('/dislikeKomentar/:idProfesora/:idKomentara', (req, res, next) => {
	const idProfesora = req.params.idProfesora;
	const idKomentara = req.params.idKomentara;
	const profData = {jmbg: idProfesora, komentari: {$elemMatch: {_id: idKomentara}}};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.update(profData, {$inc: {'komentari.$.dislikes': +1}}, (err, docs) => {
		if (err) {
			return next(err);
		}

		return res.send(docs);
	});
});

api.use((err, req, res) => {
	return res.status(err.status || 500).json({
		message: err.message,
		error: err.error,
		status: err.status
	});
});

module.exports = api;
