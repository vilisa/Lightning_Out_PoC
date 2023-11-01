// Load configuration
import dotenv from 'dotenv';
dotenv.config();

// Imports
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import express from 'express';
//import jsforce from 'jsforce';
import bodyParser from 'body-parser';
import {Salesforce} from './lib/salesforce';

// Constants
const app: express.Application = express();
const PORT: number = Number(process.env.PORT);

// Configure a new express application instance
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/../', 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname + '/../', 'public')));

//Add headers before the routes are defined

app.use(function (req, res, next) {
	//Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	//Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	//Set to true if you need the website to include cookies in the requests sent
	//to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	//Pass to next layer of middleware
	next();
});

//Set paths
//Test
app.get('/', (req, res, next) => {
	Salesforce.userLogin_OAUTH()
		.then((loginResponse) => {
			res.render(
				'pages/exampleBoth',
				Object.assign(loginResponse, {
					appNamePublic: 'c:LightningOutPublic',
					appNamePrivate: 'c:LightningOutPrivate'
				})
			);
		})
		.catch((err) => {
			return next(err);
		});
});

//Private
app.get('/private', (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');

	Salesforce.userLogin_OAUTH()
		.then((loginResponse) => {
			res.render('pages/hardcodedExamplePrivate', loginResponse);
		})
		.catch((err) => {
			return next(err);
		});
});

//Public
app.get('/public', (req, res, next) => {
	res.render('pages/hardcodedExamplePublic', {});
});

//Both
app.get('/both', (req, res, next) => {
	Salesforce.userLogin_OAUTH()
		.then((loginResponse) => {
			res.render('pages/hardcodedExamplePrivate', loginResponse);
		})
		.catch((err) => {
			return next(err);
		});
});

// Start server (HTTP & HTTPS)
const httpServer = http.createServer(app);
httpServer.listen(PORT);
console.log(`HTTP listening on port ${PORT}`);

if (process.env.SERVER === 'Localhost') {
	const httpsServer = https.createServer(
		{
			key: fs.readFileSync('./SSL/domain.key', 'utf8'),
			cert: fs.readFileSync('./SSL/domain.crt', 'utf8')
		},
		app
	);
	httpsServer.listen(PORT + 1);
	console.log(`HTTPS listening on port ${PORT + 1}`);
}
