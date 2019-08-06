// ==== MODULES ==========================================
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
import HomeIcon from '@material-ui/icons/Home';
import SpellCheckIcon from '@material-ui/icons/Spellcheck';

// ==== COMPONENTS ========================================
import Helper from '../lib/helper';
import Validator from '../lib/validator';
import PackageSummary from './package-summary-div';
import PackageItinerary from './package-itinerary-div';
import PackageRates from './package-rates-div';
import PackageModal from './package-modal-div';
import PackageDialog from './package-dialog-div';
import MobileApp from './mobile/app';

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
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
});

class PackageDetails extends React.Component {
	constructor (props) {
		super(props);

		this.getNextState = this.getNextState.bind(this);
		this.handlePackageStatusUpdate = this.handlePackageStatusUpdate.bind(this);
		this.handleShowPackageList = this.handleShowPackageList.bind(this);
		this.handleValidation = this.handleValidation.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);

		this.state = {
			updating: false,
			openModal: '',
			validation: null,
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
					icon: <PublishIcon className={this.props.classes.leftIcon} />,
				};
				break;
			case 'Published':
				nextState = {
					status: 'Archived',
					action: 'Archive',
					icon: <DeleteIcon className={this.props.classes.leftIcon} />,
				};
				break;
			case 'Archived':
				nextState = {
					status: 'Draft',
					action: 'Edit',
					icon: <EditIcon className={this.props.classes.leftIcon} />,
				};
				break;
		}
		return nextState;
	}

	/* ----------  Event Handlers  ------- */
	// Handle package state update
	handlePackageStatusUpdate (pkg) {
		// console.log('>>>>PackageDetails.handlePackageStatusUpdate', pkg);
		this.props.updatePackageState({
			id: pkg.id,
			status: this.getNextState(pkg.state).status,
			isRefreshAll: true,
		});
	}
	handleValidation () {
		const validation = Validator.validate(this.state.selectedPackage);
		this.setState({ validation: validation });
	}
	// Handle go back to package-list view
	handleShowPackageList () {
		// console.log('>>>>PackageDetails.handleShowPackageList');
		this.props.getFilteredPackages({ type: 'Template' });
	}
	// Handle modal open
	handleModalOpen (type) {
		// console.log('>>>>PackageDetails.handleModalOpen', type);
		this.setState({ openModal: type });
	}
	// Handle modal close
	handleModalClose () {
		// console.log('>>>>PackageDetails.handleModalClose');
		this.setState({ openModal: '' });
	}

	render () {
		console.log('>>>>PackageDetails.render', this.props.selectedPackage);
		const { classes, theme, selectedPackage } = this.props;
		const {
			packageSummary,
			packageItems,
			packageHotels,
			packageRates,
			carRates,
			flightRates,
			hotelRates,
			cities,
		} = selectedPackage;

		const nextState = this.getNextState(packageSummary.state);
		const btnPackageStatus
			= this.state.validation && this.state.validation.length === 0 ? (
				<Button
					variant="contained"
					color="secondary"
					className={classes.button}
					onClick={() => this.handlePackageStatusUpdate(packageSummary)}
				>
					{nextState.action}
					{nextState.icon}
				</Button>
			) : (
				''
			);
		const btnMobileView
			= this.state.validation && this.state.validation.length === 0 ? (
				<Button
					variant="contained"
					color="secondary"
					className={classes.button}
					onClick={() => this.handleModalOpen('mobile')}
				>
					<MobileViewIcon className={classes.leftIcon} />
					Mobile View
				</Button>
			) : (
				''
			);
		const btnDesktopView
			= this.state.validation && this.state.validation.length === 0 ? (
				<Button
					variant="contained"
					color="secondary"
					className={classes.button}
					onClick={() => this.handleModalOpen('desktop')}
				>
					<ComputerIcon className={classes.leftIcon} />
					Desktop View
				</Button>
			) : (
				''
			);
		// Validation errors
		let divMsgValidation = '';
		const validation = this.state.validation;
		if (!validation) {
			console.log('>>>>No validation, hide message');
		} else if (validation && validation.isValid) {
			console.log('>>>>Passed validation, show success message');
			divMsgValidation = (
				<Typography
					className={classes.dividerFullWidth}
					style={{ backgroundColor: 'lightgreen' }}
				>
					{validation.messages[0]}
				</Typography>
			);
		} else if (validation && !validation.isValid && validation.messages) {
			console.log('>>>>Failed validation, show error message');
			const divErrors = _.map(validation.messages, (err, idx) => {
				return <div key={idx}>{err}</div>;
			});
			divMsgValidation = (
				<Typography
					className={classes.dividerFullWidth}
					style={{ backgroundColor: 'red' }}
				>
					{divErrors}
				</Typography>
			);
		}

		return (
			<div className={classes.root}>
				<div>
					<Button
						variant="contained"
						color="default"
						className={classes.button}
						onClick={() => this.handleShowPackageList()}
					>
						<HomeIcon className={classes.leftIcon} />
						Home
					</Button>
					<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={() => this.handleValidation()}
					>
						<SpellCheckIcon className={classes.leftIcon} />
						Validate
					</Button>
					{btnPackageStatus}
					{btnMobileView}
					{btnDesktopView}
				</div>
				{divMsgValidation}
				<List className={classes.root}>
					<li>
						<Typography
							className={classes.dividerFullWidth}
							color="textSecondary"
							variant="caption"
						>
							Package Summary
						</Typography>
					</li>
					<Divider component="li" />
					<ListItem>
						<PackageSummary packageSummary={packageSummary} />
					</ListItem>
					<li>
						<Typography
							className={classes.dividerFullWidth}
							color="textSecondary"
							variant="caption"
						>
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
						<Typography
							className={classes.dividerFullWidth}
							color="textSecondary"
							variant="caption"
						>
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
				<PackageDialog
					open={this.state.openModal}
					handleClose={this.handleModalClose}
				>
					{this.state.openModal === 'mobile' ? (
						<MobileApp
							instPackage={Helper.dummyInstance({
								packageSummary,
								packageItems,
								packageHotels,
							})}
							rates={{ packageRates, carRates, flightRates, hotelRates }}
							reference={{ packageSummary, cities }}
						/>
					) : (
						<div />
					)}
					{this.state.openModal === 'desktop' ? (
						<div>{this.state.openModal}</div>
					) : (
						<div />
					)}
				</PackageDialog>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PackageDetails);
