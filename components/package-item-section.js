import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import MobileViewIcon from '@material-ui/icons/MobileScreenShare';
import ComputerIcon from '@material-ui/icons/Computer';
import GoBackIcon from '@material-ui/icons/KeyboardBackspace';
import PackageSummary from './package-summary-div';
import PackageItinerary from './package-itinerary-div';
import PackageRates from './package-rates-div';

const styles = theme => ({
	root: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
	dividerFullWidth: {
		margin: `5px 0 0 ${theme.spacing.unit * 2}px`,
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200,
	},
	button: {
		margin: theme.spacing.unit,
		width: 180,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

class PackageDetails extends React.Component {
	constructor (props) {
		super(props);

		this.getNextState = this.getNextState.bind(this);
		this.handlePackageStatusUpdate = this.handlePackageStatusUpdate.bind(this);
		this.handleShowPackageList = this.handleShowPackageList.bind(this);

		this.state = {
			updating: false,
		};
	}

	/* ----------  Helpers  ------- */
	// Get next status
	getNextState (status) {
		let nextState;
		switch (status) {
			case 'Draft':
				nextState = {
					status: 'Published',
					action: 'Publish',
					icon: (<PublishIcon className={this.props.classes.rightIcon} />),
				};
				break;
			case 'Published':
				nextState = {
					status: 'Archived',
					action: 'Archive',
					icon: (<DeleteIcon className={this.props.classes.rightIcon} />),
				};
				break;
			case 'Archived':
				nextState = {
					status: 'Draft',
					action: 'Edit',
					icon: (<EditIcon className={this.props.classes.rightIcon} />),
				};
				break;
		}
		return nextState;
	};

	/* ----------  Event Handlers  ------- */
	// Handle package state update
	handlePackageStatusUpdate (pkg) {
		console.log('>>>>PackageDetails.handlePackageStatusUpdate', pkg);
		this.props.updatePackageState({
			id: pkg.id,
			status: this.getNextState(pkg.state).status,
			isRefreshAll: true,
		});
	};
	// Handle go back to package-list view
	handleShowPackageList () {
		console.log('>>>>PackageDetails.handleShowPackageList');
		this.props.getFilteredPackages({});
	};

	render () {
		console.log('>>>>PackageDetails.render', this.props.selectedPackage);
		const { classes, theme, selectedPackage } = this.props;
		const { packageSummary, packageItems, packageHotels, packageRates, carRates, flightRates, hotelRates } = selectedPackage;

		const nextState = this.getNextState(packageSummary.state);
		const btnPackageStatus = (
			<Button variant="contained" color="default"
				className={classes.button}
				onClick={() => this.handlePackageStatusUpdate(packageSummary)}
			>
				{nextState.action}
				{nextState.icon}
			</Button>
		);

		return (
			<div className={classes.root}>
				<div>
					{btnPackageStatus}
					<Button variant="contained" color="default" className={classes.button}>
						Mobile View
        				<MobileViewIcon className={classes.rightIcon} />
					</Button>
					<Button variant="contained" color="default" className={classes.button}>
						Desktop View
        				<ComputerIcon className={classes.rightIcon} />
					</Button>
					<Button variant="contained" color="default"
						className={classes.button}
						onClick={() => this.handleShowPackageList()}
					>
						Return
						<GoBackIcon className={classes.rightIcon} />
					</Button>
				</div>
				<List className={classes.root}>
					<li>
						<Typography className={classes.dividerFullWidth} color="textSecondary" variant="caption">
							Package Summary
						</Typography>
					</li>
					<Divider component="li" />
					<ListItem>
						<PackageSummary
							packageSummary={packageSummary}
						/>
					</ListItem>
					<li>
						<Typography className={classes.dividerFullWidth} color="textSecondary" variant="caption">
							Package Itinerary
						</Typography>
					</li>
					<Divider component="li" />
					<ListItem>
						<PackageItinerary
							packageItems={packageItems}
							packageHotels={packageHotels}
						/>
					</ListItem>
					<li>
						<Typography className={classes.dividerFullWidth} color="textSecondary" variant="caption">
							Package Rate Plan
						</Typography>
					</li>
					<Divider component="li" />
					<ListItem>
						<PackageRates
							flightRates={flightRates}
							carRates={carRates}
							packageRates={packageRates}
							hotelRates={hotelRates}
						/>
					</ListItem>
				</List>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PackageDetails);
