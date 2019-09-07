import _ from 'lodash';
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
import Rate from '../../../lib/rate-calculator';

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
		// Set min & max
		let max = 0;
		let min = 999;
		_.each(props.rates.packageRates, pr => {
			if (pr.maxParticipant >= max) {
				max = pr.maxParticipant;
			}
			if (pr.minParticipant <= max) {
				min = pr.minParticipant;
			}
		});
		this.state = {
			adults: props.adults || 1,
			kids: props.kids || 0,
			max: max,
			min: min,
		};
	}

	buildMenuItems (maxSelect, itemText) {
		const rs = [];
		rs[rs.length] = (
			<MenuItem key={0} value={0}>
				0 {itemText}
			</MenuItem>
		);
		for (let ct = 0; ct < maxSelect; ct++) {
			rs[rs.length] = (
				<MenuItem key={ct + 1} value={ct + 1}>
					{ct + 1} {itemText}
					{ct === 0 ? '' : 's'}
				</MenuItem>
			);
		}
		return rs;
	}

	render () {
		console.log('>>>>BotHeader, render()', this.state);
		const { classes, instPackage, rates, cities } = this.props;
		const { packageRates, carRates, flightRates } = rates;
		const {
			isCustomised,
			hotels,
			items,
			totalAdults,
			totalKids,
			startDate,
			carOption,
			totalDays,
		} = instPackage;
		const { adults, kids, max, min } = this.state;
		const finalCost = { price: 0, promo: '' };
		const maxSelect = 30;

		const params = {
			startDate: startDate,
			adults: adults + totalAdults,
			kids: kids + totalKids,
		};
		// ====== Event Handler ======
		// Handle adult change
		const handleAdultsChange = e => {
			console.log('>>>>BotHeader, handleAdultsChange()', { e, packageRates });
			const { handleInvalidParticipant } = this.props;
			const total = kids + e.target.value;
			if (total > max || total < min) {
				handleInvalidParticipant({ total, max, min });
			} else {
				this.setState({ adults: e.target.value });
			}
		};
		// Handle kid change
		const handleKidsChange = e => {
			console.log('>>>>BotHeader, handleKidsChange()', { e, packageRates });
			const { handleInvalidParticipant } = this.props;
			const total = adults + e.target.value;
			if (total > max || total < min) {
				handleInvalidParticipant({ total, max, min });
			} else {
				this.setState({ kids: e.target.value });
			}
		};

		if (!isCustomised) {
			/* ==== Regular tour group ====
			 * - packageRates: totalAdults, totalKids
			 * - flightRates: startDate, endDate
			 * ============================ */
			const curRatePackageReg = Rate.calPackageRate(params, packageRates);
			if (curRatePackageReg) {
				const curRateFlight = Rate.calFlightRate(startDate, flightRates);
				var nxtRatePackageReq;
				if (
					curRatePackageReg.maxParticipant
					&& instPackage.maxParticipant > curRatePackageReg.maxParticipant
				) {
					params.adults = curRatePackageReg.maxParticipant + 1;
					params.kids = 0;
					nxtRatePackageReq = Rate.calPackageRate(params, packageRates);
				} else {
					nxtRatePackageReq = null;
				}
				const gap
					= curRatePackageReg.maxParticipant
					+ 1
					- (adults + totalAdults + kids + totalKids);
				finalCost.price = curRatePackageReg.price + curRateFlight;
				finalCost.promo = nxtRatePackageReq
					? `${gap} more people $${nxtRatePackageReq.price + curRateFlight} pp`
					: `Max group size is ${curRatePackageReg.maxParticipant}`;
			} else {
				finalCost.price = 'ERROR';
				finalCost.promo = 'ERROR';
			}
		} else {
			/* ==== DIY tour group ====
			 * - packageRates: totalAdults, totalKids, [startDate]
			 * - flightRates: [startDate], [type]
			 * - carRates: totalAdults, totalKids, [startDate], [type]
			 * - packageItems: all package items
			 * - packageHotels: To Be Added
			 * ============================ */
			const curRatePackageDiy = Rate.calPackageRate(params, packageRates);
			console.log('>>>>Rate.calPackageRate', curRatePackageDiy);
			if (curRatePackageDiy) {
				const curRateFlightDiy = Rate.calFlightRate(startDate, flightRates);
				console.log('>>>>Rate.calFlightRate', curRateFlightDiy);
				if (curRateFlightDiy) {
					const curRateCarDiy = Rate.calCarRate(
						{ ...params, carOption, hotels, items },
						carRates
					);
					console.log('>>>>Rate.calCarRate', curRateCarDiy);
					if (curRateCarDiy) {
						const curRateItemDiy = Rate.calItemRate({ startDate }, items);
						const curRateHotelDiy = Rate.calHotelRate({ startDate }, hotels);
						var nxtRatePackageDiy, nxtRateCarDiy;
						if (
							curRatePackageDiy.maxParticipant
							&& instPackage.maxParticipant > curRatePackageDiy.maxParticipant
						) {
							params.adults = curRatePackageDiy.maxParticipant + 1;
							params.kids = 0;
							nxtRatePackageDiy = Rate.calPackageRate(params, packageRates);
							nxtRateCarDiy = Rate.calCarRate(
								{ ...params, carOption, hotels, items },
								carRates
							);
						} else {
							nxtRatePackageDiy = null;
							nxtRateCarDiy = null;
						}
						const gap
							= curRatePackageDiy.maxParticipant
							+ 1
							- (adults + totalAdults + kids + totalKids);
						const nextPrice
							= nxtRatePackageDiy && nxtRateCarDiy
								? nxtRatePackageDiy.price
								  + curRateFlightDiy
								  + nxtRateCarDiy
								  + curRateItemDiy
								  + curRateHotelDiy
								: 0;
						finalCost.price
							= curRatePackageDiy.price
							+ curRateFlightDiy
							+ curRateCarDiy
							+ curRateItemDiy
							+ curRateHotelDiy;
						finalCost.promo = nxtRatePackageDiy
							? `${gap} more people $${nextPrice} pp`
							: `Max group size is ${curRatePackageDiy.maxParticipant}`;
					} else {
						finalCost.price = 'ERROR';
						finalCost.promo = 'ERROR';
					}
				} else {
					finalCost.price = 'ERROR';
					finalCost.promo = 'ERROR';
				}
			} else {
				finalCost.price = 'ERROR';
				finalCost.promo = 'ERROR';
			}
		}

		const miAdults = this.buildMenuItems(maxSelect, 'Adult');
		const miKids = this.buildMenuItems(maxSelect, 'Kid');

		return (
			<Table className={classes.table}>
				<TableBody>
					<TableRow>
						<TableCell style={{ padding: '4px', width: '22%' }}>
							{totalAdults + adults} Adults
							<br />
							{totalKids + kids} Kids
						</TableCell>
						<TableCell style={{ padding: '4px', width: '20%' }}>
							${finalCost.price} pp
						</TableCell>
						<TableCell style={{ padding: '4px', width: '33%' }}>
							{finalCost.promo}
						</TableCell>
						<TableCell style={{ padding: '4px', width: '25%' }}>
							<FormControl className={classes.formControl}>
								<Select
									value={adults}
									onChange={handleAdultsChange}
									input={<Input name="adults" id="adults-label-placeholder" />}
									displayEmpty
									name="adults"
									className={classes.selectEmpty}
								>
									{miAdults}
								</Select>
							</FormControl>
							<FormControl className={classes.formControl}>
								<Select
									value={kids}
									onChange={handleKidsChange}
									input={<Input name="kids" id="kids-label-placeholder" />}
									displayEmpty
									name="kids"
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
