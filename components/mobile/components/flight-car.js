import _ from 'lodash';
import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
// ====== Icons ======
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import HelpIcon from '@material-ui/icons/HelpOutlineRounded';

const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
	},
	helpIcon: {
		margin: theme.spacing.unit,
	},
	list: {
		width: '100%',
		minWidth: '330px',
		backgroundColor: theme.palette.background.paper,
	},
	selectEmpty: {
		marginTop: theme.spacing.unit * 2,
	},
});

class FlightCar extends React.Component {
	constructor (props) {
		super(props);

		this.handleCarChange = this.handleCarChange.bind(this);
		this.handleFlightChange = this.handleFlightChange.bind(this);
	}

	handleCarChange (event) {
		this.props.handleSelectCar(event.target.value);
	}

	handleFlightChange (event) {
		this.props.handleSelectFlight(event.target.value);
	}
	render () {
		console.log('>>>>FlightCar, render()', this.props);
		const {
			classes,
			isCustomised,
			departDates,
			carOptions,
			selectedDepartDate,
			selectedReturnDate,
			selectedCarOption,
		} = this.props;
		// Reference
		const isReadonly = carOptions && carOptions.length === 1;
		const miDepartDates = _.map(departDates, i => {
			return (
				<MenuItem key={i} value={i}>
					{i}
				</MenuItem>
			);
		});
		const miReturnDates = selectedReturnDate ? (
			<MenuItem value={selectedReturnDate}>{selectedReturnDate}</MenuItem>
		) : (
			''
		);
		const miCarOptions = carOptions
			? _.map(carOptions, i => {
				return (
						<MenuItem key={i || 0} value={i}>
							{i}
						</MenuItem>
				);
			  })
			: [];

		// Web Elements
		const divFlightOptions = (
			<ListItem>
				<ListItemIcon>
					<FlightTakeoff color="primary" />
				</ListItemIcon>
				<ListItemSecondaryAction>
					<div>
						<FormControl className={classes.formControl}>
							<Select
								value={selectedDepartDate || ''}
								onChange={this.handleFlightChange}
								displayEmpty
								inputProps={{
									name: 'departDate',
									id: 'depart-date',
								}}
							>
								<MenuItem value="" disabled>
									<em>Fly Out</em>
								</MenuItem>
								{miDepartDates}
							</Select>
						</FormControl>
						<FormControl className={classes.formControl}>
							<Select value={selectedReturnDate || ''} displayEmpty disabled>
								<MenuItem value="" disabled>
									<em>Fly Back</em>
								</MenuItem>
								{miReturnDates}
							</Select>
						</FormControl>
						<FormControl className={classes.helpIcon}>
							<HelpIcon />
						</FormControl>
					</div>
				</ListItemSecondaryAction>
			</ListItem>
		);
		const divCarOptions
			= miCarOptions && miCarOptions.length > 1 ? (
				<ListItem>
					<ListItemIcon>
						<DirectionsCar color="primary" />
					</ListItemIcon>
					<ListItemSecondaryAction>
						<FormControl className={classes.formControl} disabled={isReadonly}>
							<Select
								value={selectedCarOption || ''}
								onChange={this.handleCarChange}
								displayEmpty
								inputProps={{
									name: 'typeGroundTransport',
									id: 'typeGroundTransport-simple',
								}}
							>
								<MenuItem value="" disabled>
									<em>Ground Transport</em>
								</MenuItem>
								{miCarOptions}
							</Select>
						</FormControl>
						<FormControl className={classes.helpIcon}>
							<HelpIcon />
						</FormControl>
					</ListItemSecondaryAction>
				</ListItem>
			) : (
				''
			);

		return (
			<List className={classes.list}>
				{divFlightOptions}
				{divCarOptions ? <Divider /> : ''}
				{divCarOptions}
			</List>
		);
	}
}

FlightCar.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FlightCar);
