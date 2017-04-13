import at from './action_types.js';

export function hideCountry() {
	return {
		type: at.HIDE_COUNTRY
	};
}

export function showCountry(cc) {
	return {
		type: at.SHOW_COUNTRY,
		cc
	};
}

function requestCountry(cc) {
	return {
		type: at.REQUEST_COUNTRY,
		cc
	};
}

function receiveCountry(cc, stereotypes) {
	return {
		type: at.RECEIVE_COUNTRY,
		cc,
		stereotypes
	};
}

function receiveCountryFailure(cc, err) {
	return {
		type: at.RECEIVE_COUNTRY_FAILURE,
		cc,
		err: err
	};
}

function fetchStereotypes(cc) {
	return (dispatch) => {
		dispatch(requestCountry(cc));

		if (!window.navigator.onLine) return dispatch(receiveCountryFailure(cc, 'Not connected to the Internet'));

		return fetch(`http://stereotypemap.info/api/${cc}.json`).then(response => {
			if (!response.ok) throw new Error('fetch failed');

			return response.json();
		}).then(json => {
			dispatch(receiveCountry(cc, json));
		}).catch(err => {
			dispatch(receiveCountryFailure(cc, err));
		});
	};
}

function shouldFetchStereotypes(state, cc) {
	const country = state.cache[cc];

	if (!country) return true;
	else if (country.isFetching) return false;

	return true;
}

export function fetchStereotypesIfNeeded(cc) {
	return (dispatch, getState) => {
		if (shouldFetchStereotypes(getState(), cc)) {
			return dispatch(fetchStereotypes(cc));
		} else return Promise.resolve();
	};
}
