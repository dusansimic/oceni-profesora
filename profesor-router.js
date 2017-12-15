const express = require('express');
const mongoose = require('mongoose');

const profesorRouter = express.Router(); // eslint-disable-line new-cap

const ServerUrl = process.env.SERVER_URL || 'mongodb://localhost:27017/oceniprof';

const Profesor = require('./profesor-model');

profesorRouter.get('/', (req, res, next) => {
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

profesorRouter.post('/', (req, res, next) => {
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

profesorRouter.delete('/:id', (req, res, next) => {
	const profData = {jmbg: req.params.id};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.remove(profData, err => {
		if (err) {
			return next(err);
		}
	});
});

profesorRouter.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		message: err.message,
		error: err.error,
		status: err.status
	});
	next();
});

module.exports = profesorRouter;
