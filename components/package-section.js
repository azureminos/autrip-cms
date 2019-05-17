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
	constructor (props) {
		super(props);

		this.getNextStatus = this.getNextStatus.bind(this);
		this.handleOpenPackage = this.handleOpenPackage.bind(this);
		this.handlePackageStatus = this.handlePackageStatus.bind(this);

		this.state = {
			idSelectedPackage: this.props.selectedPackage ? this.props.selectedPackage.id : -1,
		};
	}

	/* ----------  Helpers  ------- */
	// Get next status
	getNextStatus (status) {
		let nextStatus;
		switch (status) {
			case 'Draft':
				nextStatus = 'Published';
				break;
			case 'Published':
				nextStatus = 'Archived';
				break;
			case 'Archived':
				nextStatus = 'Draft';
				break;
		}
		return nextStatus;
	};
	/* ----------  Event Handlers  ------- */
	// Handle open package
	handleOpenPackage (pkg) {
		console.log('>>>>PackageSection.handleOpenPackage', pkg);
		this.setState({ idSelectedPackage: pkg.id });
		this.props.getPackageDetails(pkg.id);
	};
	// Handle package state change
	handlePackageStatus (pkg) {
		console.log('>>>>PackageSection.handlePackageStatus', pkg);
		this.props.updatePackageState({
			id: pkg.id,
			status: this.getNextStatus(pkg.state),
			isRefreshAll: true,
		});
	};

	render () {
		const { classes, theme, packages, selectedPackage } = this.props;

		return (
			<div className={classes.root}>
				<PackageCardList
					packages={packages}
					handleOpenPackage={this.handleOpenPackage}
					handlePackageStatus={this.handlePackageStatus}
				/>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PackageSection);
