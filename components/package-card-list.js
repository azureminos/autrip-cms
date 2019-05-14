import React from 'react';
import _ from 'lodash';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
});

class PackageCardList extends React.Component {
	state = {
		status: '',
		country: '',
	};
	
	render() {
		const { classes, theme, packages } = this.props;

		let cards = _.map(packages, (pkg) => (<div key={pkg.id}>{pkg.name}</div>));


		return (
			<div className={classes.root}>
				{cards}
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PackageCardList);
