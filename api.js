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
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		const collectionProfesori = db.collection('profesori');

		collectionProfesori.find({}, {komentari: 0}).toArray((err, docs) => {
			db.close();

			if (err) {
				return res.status(err.code || 500).send({
					code: err.code || 500,
					message: err.message
				});
			}

			return res.send(docs);
		});
	});
});

api.post('/queryProfesori', (req, res) => {
	const profData = req.body;

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		const collectionProfesori = db.collection('profesori');

		collectionProfesori.find(profData).toArray((err, docs) => {
			db.close();

			if (err) {
				return res.status(err.code || 500).send({
					code: err.code || 500,
					message: err.message
				});
			}

			return res.send(docs);
		});
	});
});

api.post('/getKomentari/fromProfesor', (req, res) => {
	const profData = req.body;

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		const collectionProfesori = db.collection('profesori');

		collectionProfesori.find(profData, {komentari: 1}).toArray((err, docs) => {
			db.close();

			console.log(docs);

			if (err) {
				return res.status(err.code || 500).send({
					code: err.code || 500,
					message: err.message
				});
			}

			return res.send(JSON.stringify(docs));
		});
	});
});

api.post('/queryKomentari/fromProfesor/byOcena', (req, res) => {
	const profData = req.body.prof;
	const ocena = req.body.ocena;

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		const collectionProfesori = db.collection('profesori');

		collectionProfesori.find(profData, {komentari: 1}).toArray((err, docs) => {
			db.close();

			if (err) {
				return res.status(err.code || 500).send({
					code: err.code || 500,
					message: err.message
				});
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

api.post('/addProfesor', (req, res) => {
	const profData = req.body;

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		const collectionProfesori = db.collection('profesori');

		collectionProfesori.insertOne(profData, (err, response) => {
			db.close();

			if (err) {
				return res.status(err.code || 500).send({
					code: err.code || 500,
					message: err.message
				});
			}

			return res.send({
				insertedCount: response.insertedCount
			});
		});
	});
});

api.post('/addKomentar', (req, res) => {
	const profData = req.body.prof;
	const komentarData = req.body.komentar;
	console.log(komentarData);

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(err.code || 500).send({
				code: err.code || 500,
				message: err.message
			});
		}

		const collectionProfesori = db.collection('profesori');

		collectionProfesori.update(profData, {'$push':{'komentari':{
			'user': komentarData.user,
			'text': komentarData.text,
			'ocena': komentarData.ocena
		}}}, (err, response) => {
			db.close();

			if (err) {
				return res.status(err.code || 500).send({
					code: err.code || 500,
					message: err.message
				});
			}

			return res.send(response.upsertedCount);
		});
	});
});

module.exports = api;
