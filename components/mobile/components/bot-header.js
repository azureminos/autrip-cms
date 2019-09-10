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
import CONSTANTS from '../../../lib/constants';

const { maxRoomCapacity, standardRoomCapacity } = CONSTANTS.get().Global;
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
		console.log('>>>>BotHeader.constructor', props);
		super(props);
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
			) || 1;
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
			) || 1;

		// Set initial state
		this.state = {
			people: people,
			rooms: rooms,
			otherPeople: otherPeople,
			otherRooms: otherRooms,
		};
	}

	buildMenuItems (maxSelect, itemText) {
		const rs = [];
		for (let ct = 0; ct < maxSelect; ct++) {
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

	render () {
		console.log('>>>>BotHeader.render', this.state);
		const { classes, instPackage, rates, cities } = this.props;
		const { packageRates, carRates, flightRates } = rates;
		const { isCustomised, hotels, items, startDate, carOption } = instPackage;
		const { people, rooms, otherPeople, otherRooms } = this.state;
		// Set min & max
		let max = 0;
		let min = 999;
		_.each(this.props.rates.packageRates, pr => {
			if (pr.maxParticipant >= max) {
				max = pr.maxParticipant;
			}
			if (pr.minParticipant <= max) {
				min = pr.minParticipant;
			}
		});

		const finalCost = { price: 0, promo: '' };
		const maxSelect = 30;

		const params = {
			startDate: startDate,
			totalPeople: otherPeople + people,
			totalRooms: otherRooms + rooms,
		};
		// ====== Event Handler ======
		// Handle people change
		const handlePeopleChange = e => {
			console.log('>>>>BotHeader.handlePeopleChange', { e, packageRates });
			const { handleInvalidPeople } = this.props;
			const total = otherPeople + e.target.value;
			if (total > max || total < min) {
				handleInvalidPeople({ total, max, min });
			} else {
				const newRooms = Math.ceil(e.target.value / standardRoomCapacity);
				this.setState({ people: e.target.value, rooms: newRooms });
			}
		};
		// Handle room change
		const handleRoomChange = e => {
			console.log('>>>>BotHeader.handleRoomChange', { e, packageRates });
			const { handleInvalidRoom } = this.props;
			if (
				e.target.value > people
				|| e.target.value < Math.ceil(people / maxRoomCapacity)
			) {
				handleInvalidRoom({
					total: e.target.value,
					max: people,
					min: Math.ceil(people / maxRoomCapacity),
				});
			} else {
				this.setState({ rooms: e.target.value });
			}
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
					params.totalPeople = curRatePackageReg.maxParticipant + 1;
					nxtRatePackageReq = Rate.calPackageRate(params, packageRates);
				} else {
					nxtRatePackageReq = null;
				}
				const gap
					= curRatePackageReg.maxParticipant + 1 - (people + otherPeople);
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
						const curRateHotelDiy = Rate.calHotelRate({ startDate }, hotels);
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

		const miPeople = this.buildMenuItems(maxSelect, 'Person');
		const miRooms = this.buildMenuItems(maxSelect, 'Room');

		return (
			<Table className={classes.table}>
				<TableBody>
					<TableRow>
						<TableCell style={{ padding: '4px', width: '22%' }}>
							{otherPeople + people} People
							<br />
							{otherRooms + rooms} Rooms
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
									value={people + otherPeople}
									onChange={handlePeopleChange}
									input={<Input name="people" id="people-label-placeholder" />}
									displayEmpty
									name="people"
									className={classes.selectEmpty}
								>
									{miPeople}
								</Select>
							</FormControl>
							<FormControl className={classes.formControl}>
								<Select
									value={rooms + otherRooms}
									onChange={handleRoomChange}
									input={<Input name="rooms" id="rooms-label-placeholder" />}
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
		);
	}
}

export default withStyles(styles, { withTheme: true })(BotHeader);
