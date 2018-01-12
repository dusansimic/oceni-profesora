const express = require('express');
// JSONWebToken const jwt = require('jsonwebtoken');

const api = express.Router(); // eslint-disable-line new-cap
const profesorRouter = require('./profesor-router');
const komentarRouter = require('./komentar-router');
const ocenaRouter = require('./ocena-router');
const userRouter = require('./user-router');

/* Token verification
api.use((req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, api.get('superSecret'), (err, decoded) => {
			if (err) {
				return res.status(err.status || 500).json({
					message: err.message,
					error: err.error,
					status: err.status || 500
				});
			}
			req.decoded = decoded;
			next();
		});
	} else {
		res.status(403).json({
			ok: false,
			message: 'No token provided!'
		});
	}
});
*/
api.use('/profesor', profesorRouter);
api.use('/komentar', komentarRouter);
api.use('/ocena', ocenaRouter);
api.use('/user', userRouter);

module.exports = api;
