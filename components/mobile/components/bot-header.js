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
import CONSTANTS from '../../../lib/constants';

const InstanceStatus = CONSTANTS.get().Instance.status;
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
		const { actions, rates } = this.props;
		if (actions && actions.handlePeople) {
			const newRooms = Math.ceil(e.target.value / standardRoomCapacity);
			actions.handlePeople({ people: e.target.value, rooms: newRooms, rates });
		}
	}
	// Handle room change
	doHandleRoomChange (e) {
		console.log('>>>>BotHeader.doHandleRoomChange', e);
		const { actions, rates } = this.props;
		if (actions && actions.handleRoom) {
			actions.handleRoom({ rooms: e.target.value, rates });
		}
	}
	// Display widget
	render () {
		console.log('>>>>BotHeader.render');
		const { classes, instPackage, instPackageExt } = this.props;
		const { curGap, curRate, nxtGap, nxtRate, max } = instPackageExt;
		const { people, otherPeople, rooms, otherRooms } = instPackageExt;
		// Local variables
		const finalCost = { price: 0, promo: '' };
		const isPeopleDisabled
			= instPackage.status === InstanceStatus.PENDING_PAYMENT;
		const isRoomDisabled
			= !instPackage.isCustomised
			|| instPackage.status === InstanceStatus.PENDING_PAYMENT;

		if (curGap === 0) {
			finalCost.price = `${curRate} pp`;
			finalCost.promo
				= nxtGap > 0
					? `${nxtGap} more people ${nxtRate} pp`
					: `Max group size is ${max}`;
		} else {
			finalCost.price = `${curGap} more people $${curRate} pp`;
			finalCost.promo
				= nxtGap > 0
					? `${nxtGap} more people ${nxtRate} pp`
					: `Max group size is ${max}`;
		}

		const miPeople = this.buildMenuItems(1, max, 'Person');
		const miRooms = this.buildMenuItems(
			Math.ceil((otherPeople + people) / maxRoomCapacity) || 1,
			otherPeople + people,
			'Room'
		);

		return (
			<AppBar position="fixed" color="default" className={classes.appBar}>
				<Toolbar className={classes.toolbar}>
					<Table className={classes.table}>
						<TableBody>
							<TableRow>
								<TableCell style={{ padding: '4px', width: '22%' }}>
									{otherPeople + people} People
									<br />
									{otherRooms + rooms} Rooms
								</TableCell>
								<TableCell style={{ padding: '4px', width: '20%' }}>
									{finalCost.price}
								</TableCell>
								<TableCell style={{ padding: '4px', width: '33%' }}>
									{finalCost.promo}
								</TableCell>
								<TableCell style={{ padding: '4px', width: '25%' }}>
									<FormControl
										className={classes.formControl}
										disabled={isPeopleDisabled}
									>
										<Select
											value={otherPeople + people}
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
										disabled={isRoomDisabled}
									>
										<Select
											value={otherRooms + rooms}
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
