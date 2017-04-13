const initialState = {
	currentCc: null,
	cache: {}
};

import at from '../action_types.js';

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case at.SHOW_COUNTRY:
			return {
				...state,
				currentCc: action.cc
			};
		case at.REQUEST_COUNTRY:
			return {
				...state,
				cache: {
					...state.cache,
					[action.cc]: {
						isFetching: true
					}
				}
			};
		case at.RECEIVE_COUNTRY:
			return {
				...state,
				cache: {
					...state.cache,
					[action.cc]: {
						isFetching: false,
						stereotypes: action.stereotypes
					}
				}
			};
		case at.RECEIVE_COUNTRY_FAILURE:
			return {
				...state,
				networkError: true/*,
				cache: {
					...state.cache,
					[action.cc]: {
						isFetching: false,
					}
				}*/
			};
		case at.HIDE_COUNTRY:
			return {
				...state,
				networkError: false,
				currentCc: null
			};
		default:
			return state;
	}
}
