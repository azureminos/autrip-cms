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
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import MobileViewIcon from '@material-ui/icons/MobileScreenShare';
import ComputerIcon from '@material-ui/icons/Computer';
import HomeIcon from '@material-ui/icons/Home';
import SnapshotIcon from '@material-ui/icons/TableChartOutlined';
import SpellCheckIcon from '@material-ui/icons/Spellcheck';

// ==== COMPONENTS ========================================
import Helper from '../lib/helper';
import Validator from '../lib/validator';
import PackageSummary from './package-summary-div';
import PackageItinerary from './package-itinerary-div';
import PackageRates from './package-rates-div';
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

		this.handlePublishTemplate = this.handlePublishTemplate.bind(this);
		this.handleArchiveSnapshot = this.handleArchiveSnapshot.bind(this);
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
	/* ----------  Event Handlers  ------- */
	// Publish template snapshot
	handlePublishTemplate (id) {
		// console.log('>>>>PackageDetails.handlePackageStatusUpdate', pkg);
		this.props.publishProduct({ id });
	}
	// Archive snapshot
	handleArchiveSnapshot (id) {
		// console.log('>>>>PackageDetails.handlePackageStatusUpdate', pkg);
		this.props.archiveSnapshot({ id });
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
		const { validation } = this.state;
		const isValid = validation && validation.isValid;
		const { classes, theme, selectedPackage } = this.props;
		const {
			packageSummary,
			packageItems,
			packageHotels,
			packageRates,
			flightRates,
			cities,
			carRates,
			hotelRates,
		} = selectedPackage;
		const isTemplate = packageSummary.type === 'Template';

		const btnSnapshotList = isTemplate ? (
			<Button
				variant="contained"
				color="primary"
				className={classes.button}
				onClick={() => this.handleModalOpen('snapshot')}
			>
				<SnapshotIcon className={classes.leftIcon} />
				All Snapshots
			</Button>
		) : (
			''
		);
		const btnValidateTemplate = isTemplate ? (
			<Button
				variant="contained"
				color="primary"
				className={classes.button}
				onClick={() => this.handleValidation()}
			>
				<SpellCheckIcon className={classes.leftIcon} />
				Validate
			</Button>
		) : (
			''
		);
		const btnArchiveSnapshot = !isTemplate ? (
			<Button
				variant="contained"
				color="default"
				className={classes.button}
				onClick={() => this.handleArchiveSnapshot(packageSummary.id)}
			>
				<DeleteIcon className={this.props.classes.leftIcon} />
				Archive
			</Button>
		) : (
			''
		);
		const btnPublishProduct
			= isValid && isTemplate ? (
				<Button
					variant="contained"
					color="default"
					className={classes.button}
					onClick={() => this.handlePublishTemplate(packageSummary.id)}
				>
					<PublishIcon className={this.props.classes.leftIcon} />
					Publish
				</Button>
			) : (
				''
			);
		const btnMobileView
			= isValid || !isTemplate ? (
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
			= isValid || !isTemplate ? (
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
		if (!validation) {
			console.log('>>>>No validation, hide message');
		} else if (isValid) {
			console.log('>>>>Passed validation, show success message');
			divMsgValidation = (
				<Typography
					className={classes.dividerFullWidth}
					style={{ backgroundColor: 'lightgreen' }}
				>
					{validation.messages[0]}
				</Typography>
			);
		} else {
			console.log('>>>>Failed validation, show error message');
			const divErrors = _.map(validation.messages || [], (err, idx) => {
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
					{btnSnapshotList}
					{btnValidateTemplate}
					{btnMobileView}
					{btnDesktopView}
					{btnArchiveSnapshot}
					{btnPublishProduct}
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
					{this.state.openModal === 'snapshot' ? (
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
