import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import PackageCard from './package-card';

const styles = (theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
});

class PackageCardList extends React.Component {
	render () {
		const { classes, theme, packages, btnActionMap } = this.props;

		let cards = _.map(packages, (pkg) => (
			<PackageCard
				key={pkg.id}
				item={pkg}
				btnActionMap={btnActionMap}
			/>
		));


		return (
			<div className={classes.root}>
				{cards}
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PackageCardList);
