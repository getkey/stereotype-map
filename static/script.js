'use strict';

new Vue({
	el: '#app',
	data: {
		currentCountry: null,
		stereotypes: [],
		fetched: false,
		mouseOverBox: false,
		cache: {}
	},
	methods: {
		hideStBox: function() {
			this.currentCountry = null;
			this.stereotypes = [];
			this.fetched = false;
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
					var req = new XMLHttpRequest();
					req.open('GET', '/api/' + countryCode + '.json', true);
					req.addEventListener('load', function(ev) {
						this.cache[countryCode] = JSON.parse(ev.target.responseText);
						this.getFromCache(countryCode);
					}.bind(this));
					req.send(null);
				}
			}
		},
		outLand: function(ev) {
			if (ev.target.tagName === 'path' && !this.mouseOverBox) {
				this.hideStBox();
			}
		},
		leaveStBox: function() {
			this.mouseOverBox = false;
			this.hideStBox();
		},
		enterStBox: function() {
			this.mouseOverBox = true;
		}
	}
});

new Vue({
	el: '#info',
	data: {
		showExp: false
	}
});
