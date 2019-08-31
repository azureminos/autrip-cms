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
			adults: 1,
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

	calPackageRate (params, packageRates) {
		const { startDate, adults, kids } = params;
		const total = (adults || 0) + (kids || 0);
		if (startDate) {
			for (var i = 0; i < packageRates.length; i++) {
				const {
					minParticipant,
					maxParticipant,
					rate,
					premiumFee,
					rangeFrom,
					rangeTo,
				} = packageRates[i];
				if (
					total >= minParticipant
					&& total <= maxParticipant
					&& startDate.getTime() >= new Date(rangeFrom).getTime()
					&& startDate.getTime() <= new Date(rangeTo).getTime()
				) {
					return {
						price: rate,
						premiumFee: premiumFee,
						maxParticipant: maxParticipant,
					};
				}
			}
		} else {
			const matchedRates = _.filter(packageRates, o => {
				return total >= o.minParticipant && total <= o.maxParticipant;
			});
			if (matchedRates && matchedRates.length > 0) {
				const minRate = _.minBy(matchedRates, r => {
					return r.rate;
				});
				return {
					price: minRate.rate,
					premiumFee: minRate.premiumFee,
					maxParticipant: minRate.maxParticipant,
				};
			}
		}
		return null;
	}

	calCarRate (params, carRates) {
		const { startDate, adults, kids, totalDays, carOption } = params;
		const total = (adults || 0) + (kids || 0);
		if (startDate && carOption) {
			for (var i = 0; i < carRates.length; i++) {
				const {
					minParticipant,
					maxParticipant,
					rate,
					rangeFrom,
					rangeTo,
					type,
				} = carRates[i];
				if (
					total >= minParticipant
					&& total <= maxParticipant
					&& carOption === type
					&& startDate.getTime() >= new Date(rangeFrom).getTime()
					&& startDate.getTime() <= new Date(rangeTo).getTime()
				) {
					return rate * totalDays;
				}
			}
		} else {
			const matchedRates = _.filter(carRates, o => {
				return (
					total >= o.minParticipant
					&& total <= o.maxParticipant
					&& (!carOption || carOption === o.type)
					&& (!startDate
						|| (startDate.getTime() >= new Date(o.rangeFrom).getTime()
							&& startDate.getTime() <= new Date(o.rangeTo).getTime()))
				);
			});
			if (matchedRates && matchedRates.length > 0) {
				const minRate = _.minBy(matchedRates, r => {
					return r.rate;
				});
				return minRate.rate * totalDays;
			}
		}
		return 9999;
	}

	calFlightRate (startDate, flightRates) {
		if (startDate) {
			for (var i = 0; i < flightRates.length; i++) {
				const { rate, rangeFrom, rangeTo } = flightRates[i];
				if (
					startDate.getTime() >= new Date(rangeFrom).getTime()
					&& startDate.getTime() <= new Date(rangeTo).getTime()
				) {
					return rate;
				}
			}
		} else {
			const minRate = _.minBy(flightRates, r => {
				return r.rate;
			});
			return minRate.rate;
		}

		return 9999;
	}

	calItemRate (items, cities) {
		let totalPrice = 0;
		const tmpItems = _.filter(items, it => {
			return it.attraction;
		});
		for (var i = 0; tmpItems && i < tmpItems.length; i++) {
			var item = null;
			_.each(cities, c => {
				const matcher = _.find(c.attractions, function (a) {
					return a.id === tmpItems[i].attraction.id;
				});
				if (matcher) item = matcher;
			});
			totalPrice = totalPrice + (item ? item.rate : 0);
		}
		return totalPrice;
	}

	calHotelRate (params, hotels, cities) {
		return 0;
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
		const { adults, kids } = this.state;
		const finalCost = { price: 0, promo: '' };
		const maxSelect = 30;

		const params = {
			startDate: startDate,
			adults: adults + totalAdults,
			kids: kids + totalKids,
		};

		if (!isCustomised) {
			/* ==== Regular tour group ====
			 * - packageRates: totalAdults, totalKids
			 * - flightRates: startDate, endDate
			 * ============================ */
			const curRatePackageReg = this.calPackageRate(params, packageRates);
			if (curRatePackageReg) {
				const curRateFlight = this.calFlightRate(startDate, flightRates);
				var nxtRatePackageReq;
				if (
					curRatePackageReg.maxParticipant
					&& instPackage.maxParticipant > curRatePackageReg.maxParticipant
				) {
					params.adults = curRatePackageReg.maxParticipant + 1;
					params.kids = 0;
					nxtRatePackageReq = this.calPackageRate(params, packageRates);
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
			const curRatePackageDiy = this.calPackageRate(params, packageRates);
			if (curRatePackageDiy) {
				const curRateFlightDiy = this.calFlightRate(startDate, flightRates);
				const curRateCarDiy = this.calCarRate(
					{ ...params, totalDays, carOption },
					carRates
				);
				const curRateItemDiy = this.calItemRate(items, cities);
				const curRateHotelDiy = this.calHotelRate(
					{ startDate },
					hotels,
					cities
				);

				var nxtRatePackageDiy, nxtRateCarDiy;
				if (
					curRatePackageDiy.maxParticipant
					&& instPackage.maxParticipant > curRatePackageDiy.maxParticipant
				) {
					params.adults = curRatePackageDiy.maxParticipant + 1;
					params.kids = 0;
					nxtRatePackageDiy = this.calPackageRate(params, packageRates);
					nxtRateCarDiy = this.calCarRate(
						{ ...params, totalDays, carOption },
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
					= nxtRatePackageDiy.price
					+ curRateFlightDiy
					+ nxtRateCarDiy
					+ curRateItemDiy
					+ curRateHotelDiy;
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
									onChange={this.handleAdultdsChange}
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
									onChange={this.handleKidsChange}
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
