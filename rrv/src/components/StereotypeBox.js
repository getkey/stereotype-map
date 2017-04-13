import React, { Component } from 'react';
import { connect } from 'react-redux';


class StereotypeBox extends Component {
	render() {
		let elem = null;
		if (this.props.networkError) {
			elem = (<p>Network error, are you connected to the internet?</p>)
		} else if (this.props.isFetching) {
			elem = (<p>Fetching stereotypes, please wait...</p>);
		} else if (this.props.stereotypes && this.props.stereotypes.length !== 0) {
			elem = (<ul>
				{ this.props.stereotypes.map((stereotype, index) => <li key={ index }>{ stereotype }</li>) }
			</ul>);
		} else {
			elem = (<p>No stereotype found for this country!</p>);
		}

		return (<div id="stereotype-box">
			<p>People from { this.props.cc } are:</p>
			{ elem }
		</div>);
	}
}

export default connect((state) => {
	return {
		...state.cache[state.currentCc],
		cc: state.currentCc,
		networkError: state.networkError
	};
})(StereotypeBox);
