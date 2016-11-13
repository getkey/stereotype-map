'use strict';

let mv = new Vue({
	el: '#app',
	data: {
		currentCountry: null,
		stereotypes: [],
		fetched: false,
		mouseOverBox: false
	},
	methods: {
		hideStBox: function() {
			this.currentCountry = null;
			this.stereotypes = [];
			this.fetched = false;
		},
		overLand: function(ev) {
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
