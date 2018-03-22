const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const Profesor = require('./profesor-model');

const komentarRouter = express.Router(); // eslint-disable-line new-cap
const ServerUrl = config.serverUrl();
const superSecret = config.superSecret;

komentarRouter.get('/:id/:username', (req, res, next) => {
	const profData = {jmbg: req.params.id};
	const username = req.params.username;

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.findOne(profData, 'komentari', (err, docs) => {
		if (err) {
			return next(err);
		}

		for (let i = 0; i < docs.komentari.length; i++) {
			docs.komentari[i].liked = docs.komentari[i].liked.includes(username);
			docs.komentari[i].disliked = docs.komentari[i].disliked.includes(username);
		}

		return res.send(docs);
	});
});

komentarRouter.put('/:id', (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		let _err;
		jwt.verify(token, superSecret, (err, decoded) => {
			if (err) {
				_err = err;
			} else {
				req.decoded = decoded;
			}
		});
		if (_err) {
			return next(_err);
		}
	} else {
		return next(new Error('No access token found (not logged in)!'));
	}
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
	const token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		let _err;
		jwt.verify(token, superSecret, (err, decoded) => {
			if (err) {
				_err = err;
			} else {
				req.decoded = decoded;
			}
		});
		if (_err) {
			return next(_err);
		}
	} else {
		return next(new Error('No access token found (not logged in)!'));
	}
	const idProfesora = req.params.idProfesora;
	const idKomentara = req.params.idKomentara;
	const username = req.body.username;
	const profData = {jmbg: idProfesora, komentari: {$elemMatch: {_id: idKomentara}}};
	const usernameLikedQuery = {jmbg: idProfesora, komentari: {$elemMatch: {liked: username, _id: idKomentara}}};
	const usernameDislikedQuery = {jmbg: idProfesora, komentari: {$elemMatch: {disliked: username, _id: idKomentara}}};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.findOne(usernameLikedQuery, (err, docs) => {
		if (err) {
			return next(err);
		}
		console.log('In like');
		if (docs !== null) {
			return next(new Error('Already liked!'));
		}

		Profesor.update(profData, {$inc: {'komentari.$.likes': +1}, $push: {'komentari.$.liked': username}}, (err, docs) => {
			if (err) {
				return next(err);
			}
			console.log(docs);

			Profesor.findOne(usernameDislikedQuery, (err, docs) => {
				if (err) {
					return next(err);
				}
				if (docs === null) {
					return res.send({ok: true});
				}
				console.log('In dislike too');

				Profesor.update(profData, {$inc: {'komentari.$.dislikes': -1}, $pull: {'komentari.$.disliked': username}}, (err, result) => { // eslint-disable-line max-nested-callbacks
					if (err) {
						return next(err);
					}

					console.log(result);

					res.send({ok: true});
				});
			});
		});
	});
});

komentarRouter.put('/dislike/:idProfesora/:idKomentara', (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		let _err;
		jwt.verify(token, superSecret, (err, decoded) => {
			if (err) {
				_err = err;
			} else {
				req.decoded = decoded;
			}
		});
		if (_err) {
			return next(_err);
		}
	} else {
		return next(new Error('No access token found (not logged in)!'));
	}
	const idProfesora = req.params.idProfesora;
	const idKomentara = req.params.idKomentara;
	const username = req.body.username;
	const profData = {jmbg: idProfesora, komentari: {$elemMatch: {_id: idKomentara}}};
	const usernameLikedQuery = {jmbg: idProfesora, komentari: {$elemMatch: {liked: username, _id: idKomentara}}};
	const usernameDislikedQuery = {jmbg: idProfesora, komentari: {$elemMatch: {disliked: username, _id: idKomentara}}};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	Profesor.findOne(usernameDislikedQuery, (err, docs) => {
		if (err) {
			return next(err);
		}
		if (docs !== null) {
			return next(new Error('Already disliked!'));
		}

		Profesor.update(profData, {$inc: {'komentari.$.dislikes': +1}, $push: {'komentari.$.disliked': username}}, err => {
			if (err) {
				return next(err);
			}

			Profesor.findOne(usernameLikedQuery, (err, docs) => {
				if (err) {
					return next(err);
				}
				if (docs === null) {
					return res.send({ok: true});
				}

				Profesor.update(profData, {$inc: {'komentari.$.likes': -1}, $pull: {'komentari.$.liked': username}}, err => { // eslint-disable-line max-nested-callbacks
					if (err) {
						return next(err);
					}

					res.send({ok: true});
				});
			});
		});
	});
});

komentarRouter.delete('/:idProfesora/:idKomentara', (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		let _err;
		jwt.verify(token, superSecret, (err, decoded) => {
			if (err) {
				_err = err;
			} else {
				req.decoded = decoded;
			}
		});
		if (_err) {
			return next(_err);
		}
	} else {
		return next(new Error('No access token found (not logged in)!'));
	}
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
	if (err) {
		res.status(err.status || 500).json({
			message: err.message,
			error: err.error,
			status: err.status
		});
		console.log(err.message);
	}
	next();
});

module.exports = komentarRouter;
