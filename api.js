const express = require('express');

const api = express.Router(); // eslint-disable-line new-cap
const profesorRouter = require('./profesor-router');
const komentarRouter = require('./komentar-router');
const ocenaRouter = require('./ocena-router');

api.use('/profesor', profesorRouter);
api.use('/komentar', komentarRouter);
api.use('/ocena', ocenaRouter);

module.exports = api;
