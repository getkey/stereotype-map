const gsearch = require('gsearch'),
	countryQuery = require('country-query');

let db = null;
try {
	const fs = require('fs'),
		pgp = require('pg-promise')();

	console.log('PostreSQL: enabled');
	db = pgp(JSON.parse(fs.readFileSync('./db.json')));
} catch(err) {
	if (err.message === 'Cannot find module \'pg-promise\'') console.log('PostreSQL: disabled');
	else console.error(err);
}


let cache = {};

function validCountryCode(countryCode) {
	return countryQuery.findByCca2(countryCode) !== null;
}

function getPartialQuestions(countryCode) {
	let demonym = countryQuery.findByCca2(countryCode).demonym;

	return ['why are the ' + demonym + ' so', 'why are ' + demonym + ' so'];
}

function questionToStereotype(question, countryCode) {
	let demonym = countryQuery.findByCca2(countryCode).demonym,
		regStr = 'why are(?: the)? ' + demonym + ' so( (?!many)|$)';

	let match = question.match(new RegExp(regStr, 'i'), '');
	if (match !== null && match[1] === ' ') return match.input.replace(match[0], '');
	else return null;
}

function upToDate(countryCode) {
	if (cache[countryCode] === undefined) return false;

	let prescription = new Date(cache[countryCode].date);
	prescription.setDate(prescription.getDate() + 1); // stereotypes are valid one day

	return Date.now() < prescription;
}

function saveStereotypes(countryCode, stereotypes) {
	cache[countryCode] = {
		date: Date.now(),
		data: stereotypes
	};

	let pgDate = Math.floor(cache[countryCode].date/1000);

	if (db !== null) {
		for (let stereotype of stereotypes) {
			db.none(
				`INSERT INTO stereotype(stereotypevalue)
				SELECT '${ stereotype }'
				WHERE NOT EXISTS (
					SELECT stereotypeId
					FROM stereotype
					WHERE stereotypevalue='${ stereotype }'
				)`
			).then(() => {
				return db.none(
					`INSERT INTO association (stereotypeId, countryCode, date)
					SELECT stereotypeId, '${ countryCode }', to_timestamp(${ pgDate })
					FROM stereotype
					WHERE stereotypevalue='${ stereotype }'`
				);
			}).catch((err) => {
				console.error(err);
			});
		}
	}
}

function askQuestions(countryCode) {
	if (cache[countryCode] !== undefined && upToDate(countryCode)) return [Promise.resolve(cache[countryCode].data)];

	let promises = [];
	for (let partialQuestion of getPartialQuestions(countryCode)) {
		promises.push(new Promise((resolve, reject) => {
			gsearch.suggest(partialQuestion, (err, questions) => {
				if (err) reject(err);

				let stereotypes = [];
				for (let question of questions) {
					let stereotype = questionToStereotype(question, countryCode);
					if (stereotype !== null) stereotypes.push(stereotype);
				}

				resolve(stereotypes);
			});
		}));
	}

	generateFinalStereotypes(promises).then(stereotypes => {
		saveStereotypes(countryCode, stereotypes);
	});

	return promises;
}

function generateFinalStereotypes(answerPromises) {
	return new Promise((resolve, reject) => {
		Promise.all(answerPromises).then(allStereotypes => {
			let finalStereotypes = allStereotypes[0];
			for (let stereotypes of allStereotypes.slice(1)) {
				for (let stereotype of stereotypes) {
					if (finalStereotypes.indexOf(stereotype) === -1) finalStereotypes.push(stereotype);
				}
			}
			resolve(finalStereotypes);
		}).catch(err => {
			reject(err);
		});
	});
}

module.exports.questionToStereotype = questionToStereotype;
module.exports.getStereotypes = function(countryCode) {
	if (!validCountryCode(countryCode)) return Promise.reject(new Error('Invalid country code'));

	let answerPromises = askQuestions(countryCode);

	return generateFinalStereotypes(answerPromises);
};
