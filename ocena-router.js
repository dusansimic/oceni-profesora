const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const ocenaRouter = express.Router(); // eslint-disable-line new-cap

const ServerUrl = config.serverUrl();

const Profesor = require('./profesor-model');

ocenaRouter.put('/:id', (req, res, next) => {
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

ocenaRouter.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		message: err.message,
		error: err.error,
		status: err.status
	});
	next();
});

module.exports = ocenaRouter;
