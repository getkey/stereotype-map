// this is a Presentational Component

import React, { Component } from 'react';
import './InfoBox.css';

class InfoBox extends Component {
	constructor() {
		super();
		this.state = {
			showExp: false
		};
	}
	closeIfNotLink(ev) {
		if (ev.target.tagName !== "A") this.setState({ showExp: false });
	}
	render() {
		let content = null;
		if (!this.state.showExp) {
			content = <div id="info-button" onMouseEnter={() => this.setState({ showExp: true })} title="Information">i</div>
		} else {
			content = (<div id="explanation" onTouchEnd={ this.closeIfNotLink }>
					<p>The data is taken from Google's search suggestions. Try to type "why are the french so" in Google search box for example.<br/>
					This website merely show these sometimes surprising, and almost always politically incorrect results on the map.</p>
					<p>Want to <a href="https://github.com/getkey/stereotype-map"> learn more on how it works</a>?</p>
				</div>);
		}

		return (
			<div id="info" onMouseLeave={() => this.setState({ showExp: false })}>
				{ content }
			</div>
		);
	}
}

export default InfoBox;
