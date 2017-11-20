const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const api = express.Router();

const ServerUrl = process.env.SERVER_URL || 'mongodb://localhost:27017/oceniprof';

api.get('/', (req, res) => {
	return res.send('Api is up and running!');
});

api.get('/motd', (req, res) => {
	return res.send({motd: 'Hello world!'});
});

api.get('/getProfesori', (req, res) => {
	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(500).send(err);
		}

		const collectionProfesori = db.collection('profesori');

		collectionProfesori.find({}, {komentari: 0}).toArray((err, docs) => {
			db.close();

			if (err) {
				return res.status(500).send(err);
			}

			return res.send(docs);
		});
	});
});

api.post('/queryProfesori', (req, res) => {
	const profData = req.body;

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(500).send(err);
		}

		const collectionProfesori = db.collection('profesori');

		collectionProfesori.find(profData).toArray((err, docs) => {
			db.close();

			if (err) {
				return res.status(500).send(err);
			}

			return res.send(docs);
		});
	});
});

api.post('/getKomentari/fromProfesor', (req, res) => {
	const profData = req.body;

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(500).send(err);
		}

		const collectionProfesori = db.collection('profesori');

		collectionProfesori.find(profData, {komentari: 1}).toArray((err, docs) => {
			db.close();

			if (err) {
				return res.status(500).send(err);
			}

			return res.send(docs);
		});
	});
});

api.post('/queryKomentari/fromProfesor/byOcena', (req, res) => {
	const profData = req.body.prof;
	const ocena = req.body.ocena;

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(500).send(err);
		}

		const collectionProfesori = db.collection('profesori');

		collectionProfesori.find(profData, {komentari: 1}).toArray((err, docs) => {
			db.close();

			if (err) {
				return res.status(500).send(err);
			}

			const listaKomentara = [];
			for (let i = 0; i < docs.length; i++) {
				if (docs[i].ocena === ocena) {
					listaKomentara.push(docs[i]);
				}
			}

			return res.send(listaKomentara);
		});
	});
});

module.exports = api;
