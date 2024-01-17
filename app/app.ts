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
const LANGUAGE: string = `${process.env.LANGUAGE}`;

const LIGHTNINGOUT_APPS = {
	appNamePublic: process.env.APPNAME_PUBLIC,
	appNamePrivate: process.env.APPNAME_PRIVATE,
	experienceSiteUrl: process.env.SALESFORCE_EXPERIENCE_SITE_URL_FI,
	experienceSiteUrl_EN: process.env.SALESFORCE_EXPERIENCE_SITE_URL_EN,
	experienceSiteUrl_FI: process.env.SALESFORCE_EXPERIENCE_SITE_URL_FI,
	experienceSiteUrl_SV: process.env.SALESFORCE_EXPERIENCE_SITE_URL_SV,
	lightningUrl: process.env.SALESFORCE_LIGHTNING_URL
};

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
			res.render('pages/home', Object.assign(loginResponse, LIGHTNINGOUT_APPS));
		})
		.catch((err) => {
			return next(err);
		});
});

//FAQ
app.get('/faq/en', (req, res, next) => {
	res.render('pages/faqEN', LIGHTNINGOUT_APPS);
});
app.get('/faq/fi', (req, res, next) => {
	res.render('pages/faqFI', LIGHTNINGOUT_APPS);
});
app.get('/faq/sv', (req, res, next) => {
	res.render('pages/faqSV', LIGHTNINGOUT_APPS);
});

//Public
app.get('/public', (req, res, next) => {
	res.render('pages/public', LIGHTNINGOUT_APPS);
});

//Private
app.get('/private', (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');

	Salesforce.userLogin_OAUTH()
		.then((loginResponse) => {
			res.render('pages/private', Object.assign(loginResponse, LIGHTNINGOUT_APPS));
		})
		.catch((err) => {
			return next(err);
		});
});

//Both
app.get('/both', (req, res, next) => {
	Salesforce.userLogin_OAUTH()
		.then((loginResponse) => {
			res.render('pages/exampleBoth', Object.assign(loginResponse, LIGHTNINGOUT_APPS));
		})
		.catch((err) => {
			return next(err);
		});
});

//Private (hardcoded)
app.get('/hardcoded/private', (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');

	Salesforce.userLogin_OAUTH()
		.then((loginResponse) => {
			res.render('pages/hardcodedExamplePrivate', Object.assign(loginResponse, LIGHTNINGOUT_APPS));
		})
		.catch((err) => {
			return next(err);
		});
});

//Public (hardcoded)
app.get('/hardcoded/public', (req, res, next) => {
	res.render('pages/hardcodedExamplePublic', LIGHTNINGOUT_APPS);
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
