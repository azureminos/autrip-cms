import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
	},
	table: {
		minWidth: 700,
	},
});

function TabContainer (props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

class PackageRates extends React.Component {
	constructor (props) {
		super(props);

		this.handleTabChange = this.handleTabChange.bind(this);

		this.state = {
			updating: false,
			selectedTab: 0,
		};
	}

	/* ----------  Helpers  ------- */
	// Render Flight Rates
	renderFlightRates (flightRates, classes) {
		// console.log('>>>>PackageRates.renderFlightRates', flightRates);
		const rates = _.map(flightRates, (rate) =>
			(_.pick(rate, '_id', 'name', 'priority', 'rangeFrom', 'rangeTo', 'airline', 'type', 'cost', 'rate')));

		return (
			<Table className={classes.table}>
				<TableHead>
				<TableRow>
					<TableCell>Rate Name</TableCell>
					<TableCell align="right">Priority (High to Low)</TableCell>
					<TableCell align="right">Airline</TableCell>
					<TableCell align="right">Rate Range From</TableCell>
					<TableCell align="right">Rate Range To</TableCell>
					<TableCell align="right">Ticket Type</TableCell>
					<TableCell align="right">Ticket Cost</TableCell>
					<TableCell align="right">Ticket Price</TableCell>
				</TableRow>
				</TableHead>
				<TableBody>
					{_.map(rates, (row) => (
						<TableRow key={row._id}>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell align="right">{row.priority}</TableCell>
							<TableCell align="right">{row.airline}</TableCell>
							<TableCell align="right">{row.rangeFrom.substring(0, row.rangeFrom.indexOf('T'))}</TableCell>
							<TableCell align="right">{row.rangeTo.substring(0, row.rangeTo.indexOf('T'))}</TableCell>
							<TableCell align="right">{row.type}</TableCell>
							<TableCell align="right">{row.cost}</TableCell>
							<TableCell align="right">{row.rate}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}
	// Render Car Rates
	renderCarRates (carRates, classes) {
		//console.log('>>>>PackageRates.renderCarRates', carRates);
		const rates = _.map(carRates, (rate) =>
			(_.pick(rate, '_id', 'name', 'priority', 'type', 'rangeFrom', 'rangeTo', 'minParticipant', 'maxParticipant', 'cost', 'rate')));

		return (
			<Table className={classes.table}>
				<TableHead>
				<TableRow>
					<TableCell>Rate Name</TableCell>
					<TableCell align="right">Priority (High to Low)</TableCell>
					<TableCell align="right">Type</TableCell>
					<TableCell align="right">Rate Range From</TableCell>
					<TableCell align="right">Rate Range To</TableCell>
					<TableCell align="right">Min Onboard</TableCell>
					<TableCell align="right">Max Onboard</TableCell>
					<TableCell align="right">Cost</TableCell>
					<TableCell align="right">Price</TableCell>
				</TableRow>
				</TableHead>
				<TableBody>
					{_.map(rates, (row) => (
						<TableRow key={row._id}>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell align="right">{row.priority}</TableCell>
							<TableCell align="right">{row.type}</TableCell>
							<TableCell align="right">{row.rangeFrom.substring(0, row.rangeFrom.indexOf('T'))}</TableCell>
							<TableCell align="right">{row.rangeTo.substring(0, row.rangeTo.indexOf('T'))}</TableCell>
							<TableCell align="right">{row.minParticipant}</TableCell>
							<TableCell align="right">{row.maxParticipant}</TableCell>
							<TableCell align="right">{row.cost}</TableCell>
							<TableCell align="right">{row.rate}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}
	// Render Package Rates
	renderPackageRates (packageRates, classes) {
		// console.log('>>>>PackageRates.renderPackageRates', packageRates);
		const rates = _.map(packageRates, (rate) =>
			(_.pick(rate, '_id', 'name', 'priority', 'rangeFrom', 'rangeTo', 'minParticipant', 'maxParticipant', 'premiumFee', 'cost', 'rate')));

		return (
			<Table className={classes.table}>
				<TableHead>
				<TableRow>
					<TableCell>Rate Name</TableCell>
					<TableCell align="right">Priority (High to Low)</TableCell>
					<TableCell align="right">Rate Range From</TableCell>
					<TableCell align="right">Rate Range To</TableCell>
					<TableCell align="right">Min Onboard</TableCell>
					<TableCell align="right">Max Onboard</TableCell>
					<TableCell align="right">Premium Fee</TableCell>
					<TableCell align="right">Cost</TableCell>
					<TableCell align="right">Price</TableCell>
				</TableRow>
				</TableHead>
				<TableBody>
					{_.map(rates, (row) => (
						<TableRow key={row._id}>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell align="right">{row.priority}</TableCell>
							<TableCell align="right">{row.rangeFrom.substring(0, row.rangeFrom.indexOf('T'))}</TableCell>
							<TableCell align="right">{row.rangeTo.substring(0, row.rangeTo.indexOf('T'))}</TableCell>
							<TableCell align="right">{row.minParticipant}</TableCell>
							<TableCell align="right">{row.maxParticipant}</TableCell>
							<TableCell align="right">{row.premiumFee}</TableCell>
							<TableCell align="right">{row.cost}</TableCell>
							<TableCell align="right">{row.rate}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}
	// Render Hotel Rates
	renderHotelRates (hotelRates, classes) {
		//console.log('>>>>PackageRates.renderHotelRates', hotelRates);
		return (<div>Hotel Rates</div>);
	}
	// Render Rates Table
	renderRatesTable (tbFlightRates, tbCarRates, tbPackageRates, tbHotelRates, classes, selectedTab) {
		return (
			<div className={classes.root}>
				<Tabs value={selectedTab} onChange={this.handleTabChange} variant="fullWidth">
					<Tab label="Package Rate" />
					<Tab label="Flight Rate" />
					<Tab label="Car Rate" />
					<Tab label="Hotel Rate" />
				</Tabs>
				<TabContainer>
					{selectedTab === 0 ? tbPackageRates : (<div/>)}
					{selectedTab === 1 ? tbFlightRates : (<div/>)}
					{selectedTab === 2 ? tbCarRates : (<div/>)}
					{selectedTab === 3 ? tbHotelRates : (<div/>)}
				</TabContainer>
			</div>
		);
	}
	/* ----------  Event Handlers  ------- */
	handleTabChange (event, value) {
		this.setState({ selectedTab: value });
	};

	render () {
		const { classes, theme, flightRates, carRates, packageRates, hotelRates } = this.props;
		const { selectedTab } = this.state;
		const tbFlightRates = this.renderFlightRates(flightRates, classes);
		const tbCarRates = this.renderCarRates(carRates, classes);
		const tbPackageRates = this.renderPackageRates(packageRates, classes);
		const tbHotelRates = this.renderHotelRates(hotelRates, classes);

		return (this.renderRatesTable(tbFlightRates, tbCarRates, tbPackageRates, tbHotelRates, classes, selectedTab));
	}
}

export default withStyles(styles, { withTheme: true })(PackageRates);
