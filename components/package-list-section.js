import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import PackageCard from './package-card-div';

const styles = (theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
});

class PackageCards extends React.Component {
	constructor (props) {
		super(props);

		this.getNextStatus = this.getNextStatus.bind(this);
		this.getNextAction = this.getNextAction.bind(this);
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
	// Get next Action
	getNextAction (status) {
		let nextStatus;
		switch (status) {
			case 'Draft':
				nextStatus = 'Publish';
				break;
			case 'Published':
				nextStatus = 'Archive';
				break;
			case 'Archived':
				nextStatus = 'Edit';
				break;
		}
		return nextStatus;
	};

	/* ----------  Event Handlers  ------- */
	// Handle open package
	handleOpenPackage (pkg) {
		console.log('>>>>PackageCards.handleOpenPackage', pkg);
		this.setState({ idSelectedPackage: pkg.id });
		this.props.getPackageDetails(pkg.id);
	};
	// Handle package state change
	handlePackageStatus (pkg) {
		console.log('>>>>PackageCards.handlePackageStatus', pkg);
		this.props.updatePackageState({
			id: pkg.id,
			status: this.getNextStatus(pkg.state),
			isRefreshAll: true,
		});
	};

	render () {
		const { classes, theme, packages, getPackageDetails, updatePackageState } = this.props;

		let cards = _.map(packages, (pkg) => {
			// Init button/action of package card
			const nextAction = this.getNextAction(pkg.state);
			const btnActionMap = {};
			if (getPackageDetails) {
				btnActionMap['View Package'] = this.handleOpenPackage;
			}
			if (updatePackageState) {
				btnActionMap[`${nextAction} Package`] = this.handlePackageStatus;
			}

			return (
				<PackageCard
					key={pkg.id}
					item={pkg}
					btnActionMap={btnActionMap}
				/>
			);
		});

		return (
			<div className={classes.root}>
				{cards}
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PackageCards);
