import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CONSTANTS from '../lib/constants';

const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		paddingLeft: 8 * 3,
	},
	filterDisplay: {
		display: 'flex',
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
	},
	filterItem: {
		color: 'white',
	},
	selectEmpty: {
		marginTop: theme.spacing.unit * 2,
	},
	radio: {
		'&$checked': {
			color: 'white',
		},
	},
	checked: {},
	colorPrimary: { color: 'white' },
	formControlLabel: {
		color: 'white',
	},
});

class PackageFilters extends React.Component {
	constructor (props) {
		super(props);

		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
		this.handlePackageStatusChange = this.handlePackageStatusChange.bind(this);

		this.state = {
			status: '',
			type: 'Template',
		};
	}

	handlePackageStatusChange (event) {
		const { TravelPackage } = CONSTANTS.get();
		console.log('>>>>PackageFilters.handleChange', event.target);
		if (event.target.value === '') {
			this.props.getFilteredPackages({ isSnapshot: false });
			this.setState({ type: TravelPackage.type.TEMPLATE, status: '' });
		} else {
			this.props.getFilteredPackages({
				isSnapshot: true,
				status: event.target.value,
			});
			this.setState({
				type: TravelPackage.type.SNAPSHOT,
				status: event.target.value,
			});
		}
	}

	handleCheckboxChange (event) {
		const { TravelPackage } = CONSTANTS.get();
		console.log('>>>>PackageFilters.handleChange', event.target.value);
		if (event.target.value === TravelPackage.type.TEMPLATE) {
			this.props.getFilteredPackages({ isSnapshot: false });
			this.setState({ type: TravelPackage.type.TEMPLATE, status: '' });
		} else {
			this.props.getFilteredPackages({
				isSnapshot: true,
				status: TravelPackage.status.PUBLISHED,
			});
			this.setState({
				type: TravelPackage.type.SNAPSHOT,
				status: TravelPackage.status.PUBLISHED,
			});
		}
	}

	render () {
		// console.log('>>>>PackageFilters.render', this.props.statusFilterItems);
		const { classes, statusFilterItems } = this.props;
		const { status, type } = this.state;
		const { TravelPackage } = CONSTANTS.get();
		const isSnapshot = type === TravelPackage.type.SNAPSHOT;
		const statusDropdowns = _.map(statusFilterItems, item => {
			return (
				<MenuItem key={item} value={item}>
					{item}
				</MenuItem>
			);
		});
		const selectorStatus = isSnapshot ? (
			<Select
				className={classes.filterItem}
				value={status}
				displayEmpty
				onChange={this.handlePackageStatusChange}
				inputProps={{ name: 'status', id: 'package-status' }}
			>
				<MenuItem key="Select" value="" disabled>
					Status
				</MenuItem>
				{statusDropdowns}
			</Select>
		) : (
			''
		);

		return (
			<form className={classes.root} autoComplete="off">
				<FormControl component="fieldset">
					<div className={classes.filterDisplay}>
						<RadioGroup
							row
							aria-label="type"
							name="Type"
							value={type}
							onChange={this.handleCheckboxChange}
						>
							<FormControlLabel
								value="Template"
								classes={{ label: classes.formControlLabel }}
								control={
									<Radio
										color="primary"
										classes={{
											root: classes.radio,
											checked: classes.checked,
											colorPrimary: classes.colorPrimary,
										}}
									/>
								}
								label="Template"
							/>
							<FormControlLabel
								value="Snapshot"
								classes={{ label: classes.formControlLabel }}
								control={
									<Radio
										color="primary"
										classes={{
											root: classes.radio,
											checked: classes.checked,
											colorPrimary: classes.colorPrimary,
										}}
									/>
								}
								label="Snapshot"
							/>
						</RadioGroup>
						{selectorStatus}
					</div>
				</FormControl>
			</form>
		);
	}
}

export default withStyles(styles)(PackageFilters);
