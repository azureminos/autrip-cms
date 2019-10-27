import _ from 'lodash';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Rate from '../../../lib/rate-calculator';
import CONSTANTS from '../../../lib/constants';

const { maxRoomCapacity, standardRoomCapacity } = CONSTANTS.get().Global;
const styles = theme => ({
	appBar: {
		position: 'absolute',
		width: '100%',
		height: 80,
		top: 0,
		bottom: 'auto',
	},
	toolbar: {
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 0,
	},
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
		console.log('>>>>BotHeader.constructor', props);
		super(props);
		this.doHandlePeopleChange = this.doHandlePeopleChange.bind(this);
		this.doHandleRoomChange = this.doHandleRoomChange.bind(this);
		// Set min & max
		let max = 0;
		let min = 999;
		_.each(this.props.rates.packageRates, pr => {
			if (pr.maxParticipant >= max) {
				max = pr.maxParticipant;
			}
			if (pr.minParticipant <= min) {
				min = pr.minParticipant;
			}
		});
		// Get people & rooms
		const otherRooms
			= _.sumBy(
				_.filter(props.instPackage.members, m => {
					return m.userId !== props.userId;
				}),
				m => {
					return m.rooms;
				}
			) || 0;
		const rooms
			= _.sumBy(
				_.filter(props.instPackage.members, m => {
					return m.userId === props.userId;
				}),
				m => {
					return m.rooms;
				}
			) || Math.floor(min / standardRoomCapacity);
		const otherPeople
			= _.sumBy(
				_.filter(props.instPackage.members, m => {
					return m.userId !== props.userId;
				}),
				m => {
					return m.people;
				}
			) || 0;
		const people
			= _.sumBy(
				_.filter(props.instPackage.members, m => {
					return m.userId === props.userId;
				}),
				m => {
					return m.people;
				}
			) || min;

		// Set initial state
		this.state = {
			people: people,
			rooms: rooms,
			otherPeople: otherPeople,
			otherRooms: otherRooms,
			max: max,
			min: min,
			updated: false,
		};
	}
	// ====== Helper ======
	buildMenuItems (minSelect, maxSelect, itemText) {
		const rs = [];
		for (let ct = minSelect - 1; ct < maxSelect; ct++) {
			let miText = '';
			if (itemText === 'Person' || itemText === 'People') {
				miText = ct === 0 ? 'Person' : 'People';
			} else {
				miText = ct === 0 ? itemText : `${itemText}s`;
			}
			rs[rs.length] = (
				<MenuItem key={ct + 1} value={ct + 1}>
					{ct + 1} {miText}
				</MenuItem>
			);
		}
		return rs;
	}
	// ====== Event Handler ======
	// Handle people change
	doHandlePeopleChange (e) {
		console.log('>>>>BotHeader.doHandlePeopleChange', e);
		const newRooms = Math.floor(e.target.value / standardRoomCapacity);
		this.setState({ people: e.target.value, rooms: newRooms, update: true });
	}
	// Handle room change
	doHandleRoomChange (e) {
		console.log('>>>>BotHeader.doHandleRoomChange', e);
		this.setState({ rooms: e.target.value, update: true });
	}
	// Display widget
	render () {
		console.log('>>>>BotHeader.render', this.state);
		const { classes, instPackage, rates } = this.props;
		const { packageRates, carRates, flightRates } = rates;
		const { isCustomised, hotels, items, startDate, carOption } = instPackage;
		const {
			people,
			rooms,
			otherPeople,
			otherRooms,
			max,
			min,
			update,
		} = this.state;

		const finalCost = { price: 0, promo: '' };

		const params = {
			startDate: startDate,
			totalPeople: otherPeople + people,
			totalRooms: otherRooms + rooms,
		};

		if (!isCustomised) {
			/* ==== Regular tour group ====
			 * - packageRates: totalPeople
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
					if (!update) {
						params.totalPeople = curRatePackageReg.maxParticipant + 1;
						params.totalRooms = Math.ceil(
							params.totalPeople / standardRoomCapacity
						);
					}
					nxtRatePackageReq = Rate.calPackageRate(params, packageRates);
				} else {
					nxtRatePackageReq = null;
				}
				const gap
					= curRatePackageReg.maxParticipant + 1 - (people + otherPeople);
				const nextPrice = nxtRatePackageReq
					? nxtRatePackageReq.price
					  + curRateFlight.rate
					  + curRateFlight.rateDomesticTotal
					: 0;
				finalCost.price
					= curRatePackageReg.price
					+ curRateFlight.rate
					+ curRateFlight.rateDomesticTotal;
				finalCost.promo = nxtRatePackageReq
					? `${gap} more people $${nextPrice} pp`
					: `Max group size is ${curRatePackageReg.maxParticipant}`;
			} else {
				finalCost.price = 'ERROR';
				finalCost.promo = 'ERROR';
			}
		} else {
			/* ==== DIY tour group ====
			 * - packageRates: people, [startDate]
			 * - flightRates: [startDate], [type]
			 * - carRates: people, [startDate], [type]
			 * - packageItems: all package items
			 * - packageHotels: rooms
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
						const curRateHotelDiy = Rate.calHotelRate(params, hotels);
						var nxtRatePackageDiy, nxtRateCarDiy;
						if (
							curRatePackageDiy.maxParticipant
							&& instPackage.maxParticipant > curRatePackageDiy.maxParticipant
						) {
							params.totalPeople = curRatePackageDiy.maxParticipant + 1;
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
							= curRatePackageDiy.maxParticipant + 1 - (people + otherPeople);
						const nextPrice
							= nxtRatePackageDiy && nxtRateCarDiy
								? nxtRatePackageDiy.premiumFee
								  + curRateFlightDiy.rate
								  + curRateFlightDiy.rateDomesticTotal
								  + nxtRateCarDiy
								  + curRateItemDiy
								  + curRateHotelDiy
								: 0;
						finalCost.price
							= curRatePackageDiy.premiumFee
							+ curRateFlightDiy.rate
							+ curRateFlightDiy.rateDomesticTotal
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

		const miPeople = this.buildMenuItems(min, max, 'Person');
		const miRooms = this.buildMenuItems(
			Math.ceil(params.totalPeople / maxRoomCapacity),
			params.totalPeople,
			'Room'
		);

		return (
			<AppBar position="fixed" color="default" className={classes.appBar}>
				<Toolbar className={classes.toolbar}>
					<Table className={classes.table}>
						<TableBody>
							<TableRow>
								<TableCell style={{ padding: '4px', width: '22%' }}>
									{params.totalPeople} People
									<br />
									{params.totalRooms} Rooms
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
											value={params.totalPeople}
											onChange={this.doHandlePeopleChange}
											input={
												<Input name="people" id="people-label-placeholder" />
											}
											displayEmpty
											name="people"
											className={classes.selectEmpty}
										>
											{miPeople}
										</Select>
									</FormControl>
									<FormControl
										className={classes.formControl}
										disabled={!isCustomised}
									>
										<Select
											value={params.totalRooms}
											onChange={this.doHandleRoomChange}
											input={
												<Input name="rooms" id="rooms-label-placeholder" />
											}
											displayEmpty
											name="room"
											className={classes.selectEmpty}
										>
											{miRooms}
										</Select>
									</FormControl>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Toolbar>
			</AppBar>
		);
	}
}

export default withStyles(styles, { withTheme: true })(BotHeader);
