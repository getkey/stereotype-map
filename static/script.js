'use strict';

let mv = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!'
	},
	methods: {
		displayCountryCode: function(ev) {
			if (ev.target.tagName === "path") console.log(ev.target.id);
		}
	}
});
