'use strict';

new Vue({
	el: '#app',
	data: {
		currentCountry: null,
		stereotypes: [],
		fetched: false,
		cache: {},
		touchStartRegistered: false,
		mouseOverBox: false // used to prevent flickering
	},
	methods: {
		hideStBox: function() {
			this.currentCountry = null;
			this.stereotypes = [];
			this.fetched = false;
			this.touchStartRegistered = false;
		},
		getFromCache: function(countryCode) {
			this.stereotypes = this.cache[countryCode];
			this.fetched = true;
		},
		overLand: function(ev) {
			if (ev.target.tagName === 'path') {
				this.currentCountry = ev.target.getAttribute('title');

				let countryCode = ev.target.id;

				if (this.cache[countryCode] === null) return; // pending request

				if (this.cache[countryCode] !== undefined) {
					this.getFromCache(ev.target.id);
				} else {
					this.cache[countryCode] = null;
					var req = new XMLHttpRequest(),
						associatedCountry = this.currentCountry;
					req.open('GET', '/api/' + countryCode + '.json', true);
					req.addEventListener('load', function(ev) {
						this.cache[countryCode] = JSON.parse(ev.target.responseText);
						if (associatedCountry === this.currentCountry) {
							// if when the callback is run the displayed country is the same as the fetched country
							// then display stereotypes
							this.getFromCache(countryCode);
						}
					}.bind(this));
					req.send(null);
				}
			}
		},
		leaveStBox: function() {
			this.mouseOverBox = false;
			this.hideStBox();
		},
		enterStBox: function() {
			this.mouseOverBox = true;
		},
		outLand: function(ev) {
			if ((ev.target.tagName === 'path' && ev.toElement === undefined && !this.mouseOverBox) // desktop
			|| (ev.toElement !== undefined && ev.toElement.id !== "stereotype-box")) { // mobile
				this.hideStBox();
			}
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
