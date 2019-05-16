import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import PackageCardList from './package-card-list';

const styles = (theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
});

class PackageSection extends React.Component {
	state = {
		idSelectedPackage: this.props.selectedPackage ? this.props.selectedPackage.id : -1,
	};

	//Event Handlers
	handleOpenPackage = (pkg) => {
		console.log('>>>>PackageSection.handleOpenPackage', pkg);
		//Add here for logics to update state
		this.setState({ idSelectedPackage: pkg.id });
		this.props.getPackageDetails(pkg);
	};

	render () {
		const { classes, theme, packages, filters, selectedPackage } = this.props;
		const btnActionMap = {
			'View Package': this.handleOpenPackage,
		};
		return (
			<div className={classes.root}>
				<PackageCardList
					packages={packages}
					btnActionMap={btnActionMap}
				/>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PackageSection);
