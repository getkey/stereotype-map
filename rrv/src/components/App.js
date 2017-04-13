import React, { Component } from 'react';
import Isvg from 'react-inlinesvg';
import InfoBox from './InfoBox.js';
import StereotypeBox from './StereotypeBox.js'
import './App.css';
import './map.css';
import * as actions from '../action.js';

import { connect } from 'react-redux';

class App extends Component {
	constructor() {
		super();
		this.state = {
			mouseOverBox: false
		};
		this.overLand = App.overLand.bind(this);
		this.outLand = App.outLand.bind(this);
	}
	static overLand(ev) {
		const { dispatch } = this.props;
		if (ev.target.tagName === 'path') {
			const cc = ev.target.id;
			dispatch(actions.showCountry(cc));
			dispatch(actions.fetchStereotypesIfNeeded(cc));
		}
	}
	static outLand(ev) {
		const { dispatch } = this.props;
		if ((ev.target.tagName === 'path' && ev.toElement === undefined && !this.state.mouseOverBox) // desktop
		|| (ev.toElement !== undefined && ev.toElement.id !== 'stereotype-box')) { // mobile
			dispatch(actions.hideCountry());
		}
	}
	render() {
		return (
		<div id="app" onMouseOver={ this.overLand } onMouseOut={ this.outLand }>

			<Isvg src="worldLow.svg" uniquifyIDs={ false }>
				<p>fug :D</p>
			</Isvg>

			{ this.state.mouseOverBox || this.props.currentCc !== null ? <StereotypeBox/> : null }
			<InfoBox />
		</div>
		);
	}
}

export default connect(state => ({
	currentCc: state.currentCc
}))(App);
