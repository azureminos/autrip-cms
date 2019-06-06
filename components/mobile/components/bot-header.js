import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
	table: {
		minWidth: 200,
	},
	formControl: {
		margin: '4px',
		minWidth: 80,
	},
	selectEmpty: {
		fontSize: 'small',
	},
});

class BotHeader extends React.Component {
	constructor (props) {
		console.log('>>>>BotHeader, constructor()', props);
		super(props);

		this.state = {
			adults: 0,
			kids: 0,
		};

		this.handleAdultdsChange = this.handleAdultdsChange.bind(this);
		this.handleKidsChange = this.handleKidsChange.bind(this);
	}

	handleAdultdsChange (e) {
		console.log('>>>>BotHeader, handleAdultdsChange()', e);
		this.setState({ adults: e.target.value });
	}

	handleKidsChange (e) {
		console.log('>>>>BotHeader, handleKidsChange()', e);
		this.setState({ kids: e.target.value });
	}

	buildMenuItems (maxSelect, itemText) {
		const rs = [];
		rs[rs.length] = (<MenuItem key={0} value={0}>----Select----</MenuItem>);
		for (let ct = 0; ct < maxSelect; ct++) {
			rs[rs.length] = (<MenuItem key={ct+1} value={ct+1}>{ct+1} {itemText}{(ct === 0) ? '' : 's'}</MenuItem>);
		}
	}

	calPackageRateReg(startDate, adults, kids, packageRates) {
		const { minParticipant, maxParticipant, rate, rangeFrom, rangeTo } = packageRates;
		for (var i = 0; i < packageRates.length; i++) {
			const total = (adults || 0) + (kids || 0);
			if (total > minParticipant && total < maxParticipant
				&& startDate.getTime() > rangeFrom.getTime() && startDate.getTime() < rangeTo.getTime()) {
				return { price: rate, maxParticipant: maxParticipant };
			}
		}
		return null;
	}

	calFlightRate(startDate, flightRates) {
		const { rate, rangeFrom, rangeTo } = flightRates;
		for (var i = 0; i < packageRates.length; i++) {
			if (startDate.getTime() > rangeFrom.getTime() && startDate.getTime() < rangeTo.getTime()) {
				return rate;
			}
		}
		return 9999;
	}


	render () {
		console.log('>>>>BotHeader, render()', this.state);
		const { classes, instPackage, rates } = this.props;
		const { packageRates, carRates, flightRates, hotelRates } = rates;
		const { isCustomised, hotels, items, totalAdults, totalKids,
			startDate, endDate, carOption } = instPackage;
		const { adults, kids } = this.state;
		const finalCost = {price: 0, promo: ''};
		const maxSelect = 30;

		if (!isCustomised) {
			/* ==== Regular tour group ====
			* - packageRates: totalAdults, totalKids
			* - flightRates: startDate, endDate
			* ============================ */
			const curRatePackage = calPackageRateReg(startDate, adults + totalAdults, kids + totalKids, packageRates);
			if (curRatePackage) {
				const curRateFlight = calFlightRate(startDate, flightRates);
				const nxtRatePackage;
				if (curRatePackage.maxParticipant && instPackage.maxParticipant > curRatePackage.maxParticipant) {
					nxtRatePackage = calPackageRateReg((curRatePackage.maxParticipant + 1), kids, packageRates);
				} else {
					nxtRatePackage = null;
				}
				const gap = adults + totalAdults + kids + totalKids - curRatePackage.maxParticipant;
				finalCost = {
					price: curRatePackage.price + curRateFlight,
					promo: nxtRatePackage ? `${gap} more people $${nxtRatePackage.price} pp` : `Max group size is ${curRatePackage.maxParticipant}`,
				};
			} else {
				finalCost = {
					price: 'ERROR',
					promo: 'ERROR',
				};
			}
		} else {

		}

		const miAdults = buildMenuItems(maxSelect, 'Adult');
		const miKids = buildMenuItems(maxSelect, 'Kid');
		
		return (
			<Table className={classes.table}>
				<TableBody>
					<TableRow>
						<TableCell style={{ padding: '4px', width: '22%' }}>{totalAdults + adults} Adults<br />{totalKids + kids} Kids</TableCell>
						<TableCell style={{ padding: '4px', width: '20%' }}>${finalCost.price} pp</TableCell>
						<TableCell style={{ padding: '4px', width: '33%' }}>{finalCost.promo}</TableCell>
						<TableCell style={{ padding: '4px', width: '25%' }}>
							<FormControl className={classes.formControl}>
								<Select
									value={adults}
									onChange={this.handleAdultdsChange}
									input={<Input name='adults' id='adults-label-placeholder' />}
									displayEmpty
									name='adults'
									className={classes.selectEmpty}
								>
									{miAdults}
								</Select>
							</FormControl>
							<FormControl className={classes.formControl}>
								<Select
									value={kids}
									onChange={this.handleKidsChange}
									input={<Input name='kids' id='kids-label-placeholder' />}
									displayEmpty
									name='kids'
									className={classes.selectEmpty}
								>
									{miKids}
								</Select>
							</FormControl>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		);
	}
}

export default withStyles(styles, { withTheme: true })(BotHeader);
