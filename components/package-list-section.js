import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import PackageCard from './package-card-div';

const styles = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
});

class PackageCards extends React.Component {
	constructor (props) {
		super(props);

		this.handleOpenPackage = this.handleOpenPackage.bind(this);

		this.state = {
			idSelectedPackage: this.props.selectedPackage
				? this.props.selectedPackage.id
				: -1,
		};
	}

	/* ----------  Helpers  ------- */
	/* ----------  Event Handlers  ------- */
	// Handle open package
	handleOpenPackage (pkg) {
		console.log('>>>>PackageCards.handleOpenPackage', pkg);
		this.setState({ idSelectedPackage: pkg.id });
		this.props.getPackageDetails(pkg.id);
	}

	render () {
		const { classes, theme, packages, getPackageDetails } = this.props;

		let cards = _.map(packages, pkg => {
			// Init button/action of package card
			const btnActionMap = {};
			if (getPackageDetails) {
				btnActionMap['View Package'] = this.handleOpenPackage;
			}

			return (
				<PackageCard key={pkg.id} item={pkg} btnActionMap={btnActionMap} />
			);
		});

		return <div className={classes.root}>{cards}</div>;
	}
}

export default withStyles(styles, { withTheme: true })(PackageCards);
