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

api.put('/addOcena/:id', (req, res, next) => {
	const profData = {jmbg: req.params.id};
	const ocenaData = req.body.ocena;
	if (!ocenaData) {
		return next(new Error('Ocena ne moze da bude null!'));
	}

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.update(profData, {$push: {ocene: ocenaData}}, (err, docs) => {
		if (err) {
			return next(err);
		}

		Profesor.find(profData, 'ocene', (err, docs) => {
			if (err) {
				return next(err);
			}

			const ocene = docs[0].ocene;
			let srednjaOcena = 0;

			for (let i = 0; i < ocene.length; i++) {
				srednjaOcena += ocene[i];
			}
			srednjaOcena /= ocene.length;

			Profesor.update(profData, {$set: {srednjaOcena: srednjaOcena.toFixed(2)}}, err => {
				if (err) {
					return next(err);
				}
			});
		});

		return res.send(docs);
	});
});

api.put('/addKomentar/:id', (req, res, next) => {
	const profData = {jmbg: req.params.id};
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

api.delete('/removeProfesor/:id', (req, res, next) => {
	const profData = {jmbg: req.params.id};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.remove(profData, (err, res) => {
		if (err) {
			return next(err);
		}
	});
});

api.delete('/removeKomentar/:idProfesora/:idKomentara', (req, res, next) => {
	const idProfesora = req.params.idProfesora;
	const idKomentara = req.params.idKomentara;
	const profData = {jmbg: idProfesora, komentari: {$elemMatch: {_id: idKomentara}}};

	Profesor.update(profData, {$pull: {komentari: {_id: idKomentara}}}, (err, docs) => {
		if (err) {
			return next(err);
		}

		return res.send(docs);
	});
});

api.use((err, req, res, next) => {
	return res.status(err.status || 500).json({
		message: err.message,
		error: err.error,
		status: err.status
	});
});

module.exports = api;
