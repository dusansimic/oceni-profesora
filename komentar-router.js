const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const komentarRouter = express.Router(); // eslint-disable-line new-cap

const ServerUrl = config.serverUrl();

const Profesor = require('./profesor-model');

komentarRouter.get('/:id', (req, res, next) => {
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

komentarRouter.put('/:id', (req, res, next) => {
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

komentarRouter.put('/like/:idProfesora/:idKomentara', (req, res, next) => {
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

komentarRouter.put('/dislike/:idProfesora/:idKomentara', (req, res, next) => {
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

komentarRouter.delete('/:idProfesora/:idKomentara', (req, res, next) => {
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

komentarRouter.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		message: err.message,
		error: err.error,
		status: err.status
	});
	next();
});

module.exports = komentarRouter;
