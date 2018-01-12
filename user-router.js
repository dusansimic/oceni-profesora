const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');

const userRouter = express.Router(); // eslint-disable-line new-cap

const ServerUrl = config.serverUrl();

const User = require('./user-model');

const superSecret = config.superSecret();

userRouter.get('/:username', (req, res, next) => {
	const userQuery = {username: req.params.username};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	User.find(userQuery, (err, docs) => {
		if (err) {
			return next(err);
		}

		return res.send(docs);
	});
});

userRouter.post('/', (req, res, next) => {
	const userData = req.body;
	const userQuery = {username: userData.username};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	User.findOne(userQuery, (err, docs) => {
		if (err) {
			return next(err);
		}
		if (docs) {
			return next(new Error('User with the same username already exisits!'));
		}

		User.create(userData, err => {
			if (err) {
				return next(err);
			}

			res.json({
				ok: true
			});
		});
	});
});

userRouter.post('/auth', (req, res, next) => {
	const userData = req.body;
	const userQuery = {username: userData.username};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	User.findOne(userQuery, (err, docs) => {
		if (err) {
			return next(err);
		}
		if (!docs) {
			return next(new Error('User with that username was not found!'));
		}
		if (userData.passwordHash !== docs.passwordHash) {
			return next(new Error('Password was incorrect!'));
		}

		const payload = {
			admin: false
		};

		const token = jwt.sign(payload, superSecret, {
			expiresIn: '15m'
		});

		res.json({
			ok: true,
			token
		});
	});
});

userRouter.delete('/:username', (req, res, next) => {
	const userQuery = {username: req.params.username};

	mongoose.connect(ServerUrl, {
		useMongoClient: true
	});

	User.remove(userQuery, err => {
		if (err) {
			return next(err);
		}
	});

	res.json({ok: true});
});

userRouter.use((err, req, res, next) => {
	if (err) {
		res.status(err.status || 500).json({
			message: err.message,
			error: err.error,
			status: err.status || 500
		});
	}
	next();
});

module.exports = userRouter;
