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
		const { classes, theme, packages, handleOpenPackage, handlePackageStatus } = this.props;
		/* ----------  Helpers  ------- */
		// Get next status
		const getNextAction = (status) => {
			let nextStatus;
			switch (status) {
				case 'Draft':
					nextStatus = 'Publish';
					break;
				case 'Published':
					nextStatus = 'Archive';
					break;
				case 'Archived':
					nextStatus = 'Resume';
					break;
			}
			return nextStatus;
		};

		let cards = _.map(packages, (pkg) => {
			// Init button/action of package card
			const nextAction = getNextAction(pkg.state);
			const btnActionMap = {};
			if (handleOpenPackage) {
				btnActionMap['View Package'] = handleOpenPackage;
			}
			if (handlePackageStatus) {
				btnActionMap[`${nextAction} Package`] = handlePackageStatus;
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
			<div className={classes.root} >
				{cards}
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PackageCardList);
