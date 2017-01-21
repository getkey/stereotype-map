'use strict';

const store = new Vuex.Store({
	strict: true,
	state: {
		country: {
			cc: null,
			name: null
		},
		countryInCache: false,
		cache: {}
	},
	mutations: {
		showCountry: (state, { cc, countryName }) => {
			state.country.cc = cc;
			state.country.name = countryName;

			let stereotypes = state.cache[cc];
			state.countryInCache = stereotypes !== undefined && stereotypes !== null;
		},
		hideCountry: state => {
			state.country.cc = null;
			state.country.name = null;

			state.countryInCache = true;
		},
		cacheCountry: (state, { cc, stereotypes }) => {
			state.cache[cc] = stereotypes;

			if (state.country.cc === cc) {
				state.countryInCache = true;
			}
		}
	},
	actions: {
		fetchCountry: ({ commit, state }, cc) => {
			if (state.cache[cc] === null) return;
			if (state.cache[cc] === undefined) { // do not fecth again if the data is there already
				state.cache[cc] = null; // denotes a pending request
				let req = new XMLHttpRequest();
				req.open('GET', '/api/' + cc + '.json', true);
				req.addEventListener('load', ev => {
					commit('cacheCountry', {
						cc,
						stereotypes: JSON.parse(ev.target.responseText)
					});
				});
				req.send(null);
			}
		}
	}
});

new Vue({
	el: '#app',
	store,
	data: {
		touchStartRegistered: false,
		mouseOverBox: false // used to prevent flickering
	},
	computed: {
		showCountryBox: function() {
			return this.$store.state.country.cc !== null && this.$store.state.country.name !== null;
		},
		stereotypesKnown: function() {
			return this.$store.state.countryInCache;
		},
		stereotypes: function() {
			return this.$store.state.cache[this.$store.state.country.cc];
		},
		countryName: function() {
			return this.$store.state.country.name;
		}
	},
	methods: {
		overLand: function(ev) {
			if (ev.target.tagName === 'path') {
				this.$store.commit('showCountry', {
					cc: ev.target.id,
					countryName: ev.target.getAttribute('title')
				});
				this.$store.dispatch('fetchCountry', ev.target.id);
			}
		},
		outLand: function(ev) {
			if ((ev.target.tagName === 'path' && ev.toElement === undefined && !this.mouseOverBox) // desktop
			|| (ev.toElement !== undefined && ev.toElement.id !== "stereotype-box")) { // mobile
				this.$store.commit('hideCountry');
			}
		},
		hideStBox: function() {
			this.touchStartRegistered = false;
			this.$store.commit('hideCountry');
		},
		leaveStBox: function() {
			this.mouseOverBox = false;
			this.hideStBox();
		},
		enterStBox: function() {
			this.mouseOverBox = true;
		},
		touchStartStBox: function(ev) {
			this.touchStartRegistered = true;
			// if set, when we'll get a touchend, we will be sure the touchstart originated from the StBox
		},
		touchEndStBox: function(ev) {
			// if the user selects text, there will not be a touchstart event, only touchend
			if (this.touchStartRegistered) this.hideStBox();
		}
	}
});

new Vue({
	el: '#info',
	data: {
		showExp: false
	},
	methods: {
		closeIfNotLink: function(ev) {
			if (ev.target.tagName !== "A") this.showExp = false;
		}
	}
});
