'use strict';

var mv = new Vue({
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
			console.log(this.cache);
			if (ev.target.tagName === 'path') {
				this.currentCountry = ev.target.getAttribute('title');
				if (this.cache[ev.target.id] !== undefined) {
					this.getFromCache(ev.target.id);
				} else {
					var req = new XMLHttpRequest(),
						countryCode = ev.target.id;
					req.open('GET', '/api/' + ev.target.id + '.json', true);
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
		leaveStBox: function(ev) {
			this.mouseOverBox = false;
			this.hideStBox();
		},
		enterStBox: function(ev) {
			this.mouseOverBox = true;
		}
	}
});
