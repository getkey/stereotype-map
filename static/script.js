'use strict';

let mv = new Vue({
	el: '#app',
	data: {
		currentCountry: null,
		stereotypes: [],
		fetched: false
	},
	methods: {
		displayStereotypes: function(ev) {
			if (ev.target.tagName === 'path') {
				this.currentCountry = ev.target.getAttribute('title');
				var req = new XMLHttpRequest();
				req.open('GET', '/api/' + ev.target.id + '.json', true);
				req.addEventListener('load', function(ev) {
					this.stereotypes = JSON.parse(ev.target.responseText);
					this.fetched = true;
				}.bind(this));
				req.send(null);
			}
		},
		hideStereotypes: function(ev) {
			if (ev.target.tagName === 'path') {
				this.currentCountry = null;
				this.stereotypes = [];
				this.fetched = false;
			}
		}
	}
});
