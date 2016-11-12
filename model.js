const gsearch = require('gsearch'),
	countryQuery = require('country-query');

function validCountryCode(countryCode) {
	return countryQuery.findByCca2(countryCode) !== null;
}

function getPartialQuestion(countryCode) {
	let demonym = countryQuery.findByCca2(countryCode).demonym;

	return 'why are ' + demonym + ' so';
}

module.exports.questionToStereotype = function questionToStereotype(question) {
	let match = question.match(/why are .+ so( |$)/i, '');
	if (match !== null && match[1] === ' ') return match.input.replace(match[0], '');
	else return null;
}

module.exports.getStereotypes = function(countryCode) {
	return new Promise((resolve, reject) => {
		if (!validCountryCode(countryCode)) reject(new Error('Invalid country code'));

		gsearch.suggest(getPartialQuestion(countryCode), (err, questions, res) => {
			if (err) reject(err);

			let stereotypes = [];
			for (let question of questions) {
				let stereotype = questionToStereotype(question);
				if (stereotype !== null) stereotypes.push(stereotype);
			}

			resolve(stereotypes);
		});
	});
}
