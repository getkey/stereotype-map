const gsearch = require('gsearch'),
	countryQuery = require('country-query');

function validCountryCode(countryCode) {
	return countryQuery.findByCca2(countryCode) !== null;
}

function getPartialQuestions(countryCode) {
	let demonym = countryQuery.findByCca2(countryCode).demonym;

	return ['why are the ' + demonym + ' so', 'why are ' + demonym + ' so'];
}

function questionToStereotype(question) {
	let match = question.match(/why are(?: the)? .+ so( |$)/i, '');
	if (match !== null && match[1] === ' ') return match.input.replace(match[0], '');
	else return null;
}

module.exports.questionToStereotype = questionToStereotype;
module.exports.getStereotypes = function(countryCode) {
		if (!validCountryCode(countryCode)) return Promise.reject(new Error('Invalid country code'));

		let promises = [];
		for (let partialQuestion of getPartialQuestions(countryCode)) {
			promises.push(new Promise((resolve, reject) => {
				gsearch.suggest(partialQuestion, (err, questions, res) => {
					if (err) reject(err);

					let stereotypes = [];
					for (let question of questions) {
						let stereotype = questionToStereotype(question);
						if (stereotype !== null) stereotypes.push(stereotype);
					}

					resolve(stereotypes);
				});
			}));
		}


	return new Promise((resolve, reject) => {
		Promise.all(promises).then(allStereotypes => {
			let finalStereotypes = allStereotypes[0];
			for (let stereotypes of allStereotypes.slice(1)) {
				for (let stereotype of stereotypes) {
					if (finalStereotypes.indexOf(stereotype) === -1) finalStereotypes.push(stereotype);
				}
			}
			resolve(finalStereotypes);
		});
	});
}
