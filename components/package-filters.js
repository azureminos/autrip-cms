import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';


const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		paddingLeft: 8 * 3,
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
	},
	selectedItem: {
		color: 'white',
	},
	selectEmpty: {
		marginTop: theme.spacing.unit * 2,
	},
});

class PackageFilters extends React.Component {
	state = {
		status: '',
	};

	handlePackageStatusChange = event => {
		console.log('>>>>PackageFilters.handleChange', event.target);
		if(event.target.value == 'All') {
			this.props.getFilteredPackages({});
		} else {
			this.props.getFilteredPackages({state: event.target.value});
		}
		this.setState({ [event.target.name]: event.target.value });
	};

	render () {
		console.log('>>>>PackageFilters.render', this.props.statusFilterItems);
		const { classes, statusFilterItems } = this.props;
		const statusDropdowns = _.map(statusFilterItems, (item) => {
			return (<MenuItem key={item} value={item}>{item}</MenuItem>);
		});

		return (
			<form className={classes.root} autoComplete="off">
				<FormControl className={classes.formControl}>
					<Select
						className={classes.selectedItem}
						value={this.state.status}
						displayEmpty
						onChange={this.handlePackageStatusChange}
						inputProps={{ name: 'status', id: 'package-status' }}
					>
						<MenuItem key="Select" value="" disabled >Status</MenuItem>
						<MenuItem key="All" value="All" >All</MenuItem>
						{statusDropdowns}
					</Select>
				</FormControl>
			</form>
		);
	}
}

export default withStyles(styles)(PackageFilters);
