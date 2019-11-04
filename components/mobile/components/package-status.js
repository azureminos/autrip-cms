import _ from 'lodash';
import React, { createElement } from 'react';
import { withStyles } from '@material-ui/core/styles';

// ====== Icons ======

const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
});

class PackageStatus extends React.Component {
	constructor (props) {
		super(props);
	}

	render () {
		console.log('>>>>PackageStatus, render()', this.props);
		const { classes, members } = this.props;
		// Local Variables

		// Web Elements

		return <div>Hello</div>;
	}
}

export default withStyles(styles)(PackageStatus);
