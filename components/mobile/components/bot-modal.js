import _ from 'lodash';
import React from 'react';
import getConfig from 'next/config';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid, Modal, Button, Checkbox } from '@material-ui/core';
import { PayPalButton } from 'react-paypal-button-v2';
import CONSTANTS from '../../../lib/constants';

const ModalConst = CONSTANTS.get().Modal;
const InstStatus = CONSTANTS.get().Instance.status;
const { publicRuntimeConfig } = getConfig();

const styles = theme => ({
	paper: {
		position: 'relative',
		width: 500,
		backgroundColor: theme.palette.background.paper,
		outline: 'none',
		top: '50%',
		left: '50%',
		transform: `translate(-50%, -50%)`,
	},
	headerContainer: {
		padding: 8,
	},
	bodyContainer: {
		padding: 8,
	},
	bodyContent: {
		display: 'contents',
	},
	footerContainer: {
		display: 'contents',
		position: 'absolute',
		bottom: 0,
	},
	button: {
		width: '100%',
	},
	terms: {
		display: 'flex',
		alignItems: 'flex-start',
		cursor: 'pointer',
		marginTop: 8,
	},
});

const format = (input, replacements) => {
	const keys = _.keys(replacements);
	_.each(keys, k => {
		input = input.replace(k, replacements[k]);
	});
	return input;
};

class BotModal extends React.Component {
	constructor (props) {
		console.log('>>>>BotModal.constructor', props);
		super(props);
		// Set initial state
		this.state = {
			isTermsAgreed: false,
		};
	}
	render () {
		const { isTermsAgreed } = this.state;
		const { classes, modal, actions, reference } = this.props;

		// Event Handler
		const checkTermsHandler = e => {
			console.log('>>>>ProductPayment Terms updated', e);
			e.preventDefault();
			this.setState({ isTermsAgreed: !this.state.isTermsAgreed });
		};
		// Sub Components
		const secModal = {};
		if (modal === ModalConst.LESS_THAN_MIN.key) {
			const replacements = { '#Min#': reference.min };
			const pBtnModal = [
				{
					title: ModalConst.button.CLOSE,
					handleClick: actions.handleModalClose,
				},
			];
			secModal.title = format(ModalConst.LESS_THAN_MIN.title, replacements);
			secModal.description = ModalConst.LESS_THAN_MIN.description;
			secModal.buttons = pBtnModal;
		} else if (modal === ModalConst.ZERO_OWNER.key) {
			const replacements = { '#Min#': reference.min };
			const pBtnModal = [
				{
					title: ModalConst.button.CLOSE,
					handleClick: actions.handleModalClose,
				},
			];
			secModal.title = format(ModalConst.ZERO_OWNER.title, replacements);
			secModal.description = ModalConst.ZERO_OWNER.description;
			secModal.buttons = pBtnModal;
		} else if (modal === ModalConst.ENABLE_DIY.key) {
			const pBtnModal = [
				{ title: ModalConst.button.YES, handleClick: actions.enablePackageDiy },
				{ title: ModalConst.button.NO, handleClick: actions.handleModalClose },
			];
			secModal.title = ModalConst.ENABLE_DIY.title;
			secModal.description = ModalConst.ENABLE_DIY.description;
			secModal.buttons = pBtnModal;
		} else if (modal === ModalConst.INVALID_DATE.key) {
			const pBtnModal = [
				{ title: ModalConst.button.OK, handleClick: actions.handleModalClose },
			];
			secModal.title = ModalConst.INVALID_DATE.title;
			secModal.description = ModalConst.INVALID_DATE.description;
			secModal.buttons = pBtnModal;
		} else if (modal === ModalConst.SUBMIT_PAYMENT.key) {
			// Local Variables
			const { PAYPAL_ENV, PAYPAL_ID, PAYPAL_DUMMY_ID } = publicRuntimeConfig;
			const { TERMS_CONDS, DEF_CURRENCY, DEF_DEPOSIT } = publicRuntimeConfig;
			const paypalId
				= PAYPAL_ENV === 'production' ? PAYPAL_ID : PAYPAL_DUMMY_ID;
			const { dtStart, dtEnd, people, rooms, rate, totalRate } = reference;
			const divTime = (
				<tr>
					<td>
						<b>Fly Out / Fly Back</b>
					</td>
					<td>
						{`${dtStart.toLocaleDateString()} / ${dtEnd.toLocaleDateString()}`}
					</td>
				</tr>
			);
			const divPeople = (
				<tr>
					<td>
						<b>Total Travellers</b>
					</td>
					<td>{people}</td>
				</tr>
			);
			const divRooms = (
				<tr>
					<td>
						<b>Total Rooms</b>
					</td>
					<td>{rooms}</td>
				</tr>
			);
			const divRate = (
				<tr>
					<td>
						<b>Package Rate</b>
					</td>
					<td>{rate}</td>
				</tr>
			);
			const divTotal = (
				<tr>
					<td>
						<b>Total Price</b>
					</td>
					<td>{totalRate}</td>
				</tr>
			);
			const divDeposit = DEF_DEPOSIT ? (
				<tr>
					<td>
						<b>Deposit</b>
					</td>
					<td>{DEF_DEPOSIT}</td>
				</tr>
			) : (
				''
			);
			const divTerms = (
				<div>
					<label onClick={checkTermsHandler} className={classes.terms}>
						<Checkbox checked={isTermsAgreed} color="primary" />
						<div style={{ paddingTop: 12 }}>{TERMS_CONDS}</div>
					</label>
				</div>
			);
			const divPayment = isTermsAgreed ? (
				<PayPalButton
					options={{
						clientId: paypalId,
						currency: DEF_CURRENCY,
					}}
					style={{
						layout: 'horizontal',
						color: 'gold',
						shape: 'rect',
						label: 'pay',
						tagline: false,
					}}
					amount={String(DEF_DEPOSIT > 0 ? DEF_DEPOSIT : totalRate)}
					onSuccess={details => {
						console.log('paypal integration success', details);
						if (details.status === 'COMPLETED') {
							const result = {
								status:
									DEF_DEPOSIT > 0
										? InstStatus.DEPOSIT_PAID
										: InstStatus.FULLY_PAID,
							};
							actions.handlePayment(result);
						}
					}}
					onError={err => {
						console.log('paypal integration generic error', err);
					}}
					catchError={err => {
						console.log('paypal integration transaction error', err);
					}}
				/>
			) : (
				<div className={classes.panelBody}>
					<p style={{ color: 'red' }}>
						<b>
							In order to proceed with the payment, please read the terms and
							conditions, then tick the checkbox above.
						</b>
					</p>
				</div>
			);
			const pBtnModal = [
				{
					title: ModalConst.button.CLOSE,
					handleClick: actions.handleModalClose,
				},
			];
			secModal.title = ModalConst.SUBMIT_PAYMENT.title;
			secModal.description = ModalConst.SUBMIT_PAYMENT.description;
			secModal.buttons = pBtnModal;
			secModal.contents = (
				<Grid container className={classes.bodyContent}>
					<table>
						{divTime}
						{divPeople}
						{divRooms}
						{divRate}
						{divDeposit}
					</table>
					{divTerms}
					{divPayment}
				</Grid>
			);
		} else if (modal === ModalConst.DELETE_ITINERARY.key) {
			const dayNo = `Day ${reference.dayNo || ''}`;
			const replacements = {
				'#Day#': dayNo,
			};
			const pBtnModal = [
				{
					title: ModalConst.button.YES,
					handleClick: actions.handleDeleteItinerary,
				},
				{ title: ModalConst.button.NO, handleClick: actions.handleModalClose },
			];
			secModal.title = format(ModalConst.DELETE_ITINERARY.title, replacements);
			secModal.description = format(
				ModalConst.DELETE_ITINERARY.description,
				replacements
			);
			secModal.buttons = pBtnModal;
		} else if (modal === ModalConst.FAILED_DELETE_ITINERARY.key) {
			const dayNo = `Day ${reference.dayNo || ''}`;
			const aList = _.filter(reference.attractions, it => {
				return it.isRequired;
			});
			const attractions = _.map(aList, a => {
				return a.name;
			});
			const replacements = {
				'#Day#': dayNo,
				'#Attractions#': attractions.toString(),
			};
			const pBtnModal = [
				{ title: ModalConst.button.OK, handleClick: actions.handleModalClose },
			];
			secModal.title = format(
				ModalConst.FAILED_DELETE_ITINERARY.title,
				replacements
			);
			secModal.description = format(
				ModalConst.FAILED_DELETE_ITINERARY.description,
				replacements
			);
			secModal.buttons = pBtnModal;
		} else if (modal === ModalConst.ADD_ITINERARY.key) {
			const dayNo = `Day ${reference.dayNo || ''}`;
			const replacements = {
				'#Day#': dayNo,
			};
			const pBtnModal = [
				{
					title: ModalConst.button.YES,
					handleClick: actions.handleAddItinerary,
				},
				{ title: ModalConst.button.NO, handleClick: actions.handleModalClose },
			];
			secModal.title = format(ModalConst.ADD_ITINERARY.title, replacements);
			secModal.description = format(
				ModalConst.ADD_ITINERARY.description,
				replacements
			);
			secModal.buttons = pBtnModal;
		} else if (modal === ModalConst.FULL_ITINERARY.key) {
			const dayNo = `Day ${reference.dayNo || ''}`;
			const replacements = {
				'#Day#': dayNo,
			};
			const pBtnModal = [
				{ title: ModalConst.button.OK, handleClick: actions.handleModalClose },
			];
			secModal.title = format(ModalConst.FULL_ITINERARY.title, replacements);
			secModal.description = format(
				ModalConst.FULL_ITINERARY.description,
				replacements
			);
			secModal.buttons = pBtnModal;
		} else if (modal === ModalConst.ONLY_ITINERARY.key) {
			const dayNo = `Day ${reference.dayNo || ''}`;
			const replacements = {
				'#Day#': dayNo,
			};
			const pBtnModal = [
				{ title: ModalConst.button.OK, handleClick: actions.handleModalClose },
			];
			secModal.title = format(ModalConst.ONLY_ITINERARY.title, replacements);
			secModal.description = format(
				ModalConst.ONLY_ITINERARY.description,
				replacements
			);
			secModal.buttons = pBtnModal;
		} else if (modal === ModalConst.INVALID_MAX_PARTICIPANT.key) {
			const max = reference.max || 0;
			const replacements = {
				'#Max#': max,
			};
			const pBtnModal = [
				{ title: ModalConst.button.OK, handleClick: actions.handleModalClose },
			];
			secModal.title = ModalConst.INVALID_MAX_PARTICIPANT.title;
			secModal.description = format(
				ModalConst.INVALID_MAX_PARTICIPANT.description,
				replacements
			);
			secModal.buttons = pBtnModal;
		} else if (modal === ModalConst.INVALID_MIN_PARTICIPANT.key) {
			const min = reference.min || 0;
			const replacements = {
				'#Min#': min,
			};
			const pBtnModal = [
				{ title: ModalConst.button.OK, handleClick: actions.handleModalClose },
			];
			secModal.title = ModalConst.INVALID_MIN_PARTICIPANT.title;
			secModal.description = format(
				ModalConst.INVALID_MIN_PARTICIPANT.description,
				replacements
			);
			secModal.buttons = pBtnModal;
		}
		// Sub Components
		const dButtons = _.map(secModal.buttons, b => {
			return (
				<Grid item xs>
					<Button
						key={b.title}
						onClick={() => {
							b.handleClick();
						}}
						className={classes.button}
					>
						{b.title}
					</Button>
				</Grid>
			);
		});
		// Display Widget
		return (
			<div>
				<Modal open={!!modal} onClose={() => actions.handleModalClose()}>
					<div className={classes.paper}>
						<Typography
							variant="h6"
							id="modal-title"
							className={classes.headerContainer}
						>
							{secModal.title}
						</Typography>
						<div className={classes.bodyContainer}>
							<Typography variant="subtitle1" id="simple-modal-description">
								{secModal.description}
							</Typography>
							{secModal.contents ? secModal.contents : ''}
						</div>
						<Grid container className={classes.footerContainer}>
							{dButtons}
						</Grid>
					</div>
				</Modal>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(BotModal);
