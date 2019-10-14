import _ from 'lodash';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import IconBackward from '@material-ui/icons/ArrowBack';
import IconForward from '@material-ui/icons/ArrowForward';
import IconShare from '@material-ui/icons/Share';
import IconPayment from '@material-ui/icons/Payment';
import IconPersonAdd from '@material-ui/icons/PersonAdd';
import IconPersonAddUndo from '@material-ui/icons/Undo';
import IconLock from '@material-ui/icons/Lock';
import IconStatus from '@material-ui/icons/TrackChanges';
import CONSTANTS from '../../../lib/constants';

const { Instance } = CONSTANTS.get();
const { diy, regular } = CONSTANTS.get().Steps;

const styles = theme => ({
	button: {
		width: '100%',
		height: '100%',
		padding: 0,
	},
	label: {
		// Aligns the content of the button vertically.
		flexDirection: 'column',
	},
	rightIcon: {
		paddingLeft: theme.spacing.unit,
	},
	appBar: {
		position: 'absolute',
		width: '100%',
		height: 60,
		top: 'auto',
		bottom: 0,
	},
	toolbar: {
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 0,
	},
});

const calcVisibility = (instPackage, extras) => {
	const vs = {
		BtnBackward: { isHidden: true, isDisabled: false },
		BtnForward: { isHidden: true, isDisabled: false },
		BtnShare: { isHidden: true, isDisabled: false },
		BtnPayment: { isHidden: true, isDisabled: false },
		BtnJoin: { isHidden: true, isDisabled: false },
		BtnLeave: { isHidden: true, isDisabled: false },
		BtnLock: { isHidden: true, isDisabled: false },
		BtnStatus: { isHidden: true, isDisabled: false },
	};
	// Logic starts here
	if (!extras.isCustomised) {
		if (extras.isOwner) {
			if (extras.statusMember === Instance.status.INITIATED) {
				vs.BtnForward.isHidden = false;
				vs.BtnShare.isHidden = false;
			} else if (extras.statusMember === Instance.status.SUBMIT_PAYMENT) {
				vs.BtnBackward.isHidden = false;
				vs.BtnShare.isHidden = false;
				vs.BtnPayment.isHidden = false;
			} else if (extras.statusMember === Instance.status.DEPOSIT_PAID) {
				vs.BtnShare.isHidden = false;
				vs.BtnStatus.isHidden = false;
				vs.BtnLock.isHidden = false;
			} else {
				vs.BtnShare.isHidden = false;
			}
		} else {
			if (!extras.statusMember) {
				vs.BtnJoin.isHidden = false;
			} else if (extras.statusMember === Instance.status.INITIATED) {
				vs.BtnForward.isHidden = false;
				vs.BtnShare.isHidden = false;
				vs.BtnLeave.isHidden = false;
			} else if (extras.statusMember === Instance.status.SUBMIT_PAYMENT) {
				vs.BtnBackward.isHidden = false;
				vs.BtnShare.isHidden = false;
				vs.BtnPayment.isHidden = false;
			} else if (extras.statusMember === Instance.status.DEPOSIT_PAID) {
				vs.BtnShare.isHidden = false;
				vs.BtnStatus.isHidden = false;
			} else {
				vs.BtnShare.isHidden = false;
			}
		}
	} else {
		if (extras.isOwner) {
			if (
				extras.statusMember === Instance.status.INITIATED
				|| extras.statusMember === Instance.status.SELECT_ATTRACTION
			) {
				vs.BtnForward.isHidden = false;
				vs.BtnShare.isHidden = false;
			} else if (extras.statusMember === Instance.status.SELECT_HOTEL) {
				vs.BtnBackward.isHidden = false;
				vs.BtnForward.isHidden = false;
				vs.BtnShare.isHidden = false;
			} else if (extras.statusMember === Instance.status.SUBMIT_PAYMENT) {
				vs.BtnBackward.isHidden = false;
				vs.BtnShare.isHidden = false;
				vs.BtnPayment.isHidden = false;
			} else if (extras.statusMember === Instance.status.DEPOSIT_PAID) {
				vs.BtnShare.isHidden = false;
				vs.BtnStatus.isHidden = false;
				vs.BtnLock.isHidden = false;
			} else {
				vs.BtnShare.isHidden = false;
			}
		} else {
			if (!extras.statusMember) {
				vs.BtnJoin.isHidden = false;
			} else if (
				extras.statusMember === Instance.status.INITIATED
				|| extras.statusMember === Instance.status.SELECT_ATTRACTION
				|| extras.statusMember === Instance.status.SELECT_HOTEL
			) {
				vs.BtnShare.isHidden = false;
				vs.BtnLeave.isHidden = false;
			} else if (extras.statusMember === Instance.status.SUBMIT_PAYMENT) {
				vs.BtnShare.isHidden = false;
				vs.BtnPayment.isHidden = false;
				vs.BtnLeave.isHidden = false;
			} else if (extras.statusMember === Instance.status.DEPOSIT_PAID) {
				vs.BtnShare.isHidden = false;
				vs.BtnStatus.isHidden = false;
			} else {
				vs.BtnShare.isHidden = false;
			}
		}
	}

	return vs;
};

class BotFooter extends React.Component {
	constructor (props) {
		console.log('>>>>BotFooter.constructor', props);
		super(props);
		// Set initial state
		this.state = {};
	}
	// Render footer bar, including buttons []
	render () {
		console.log('>>>>BotFooter.render', this.state);
		const { classes, instPackage, extras, actions } = this.props;
		const {
			handleBackward,
			handleForward,
			handleShare,
			handlePayment,
			handleJoin,
			handleLeave,
			handleLock,
			handleStatus,
		} = actions;
		const vs = calcVisibility(instPackage, extras);
		// ====== Event Handler ======
		const doHandleBackward = () => {
			console.log('>>>>BotFooter.doHandleBackward');
			handleBackward();
		};
		const doHandleForward = () => {
			console.log('>>>>BotFooter.doHandleForward');
			handleForward();
		};
		const doHandleShare = () => {
			console.log('>>>>BotFooter.doHandleShare');
			handleShare();
		};
		const doHandlePayment = () => {
			console.log('>>>>BotFooter.doHandlePayment');
			handlePayment();
		};
		const doHandleJoin = () => {
			console.log('>>>>BotFooter.doHandleJoin');
			handleJoin();
		};
		const doHandleLeave = () => {
			console.log('>>>>BotFooter.doHandleLeave');
			handleLeave();
		};
		const doHandleLock = () => {
			console.log('>>>>BotFooter.doHandleLock');
			handleLock();
		};
		const doHandleStatus = () => {
			console.log('>>>>BotFooter.doHandleStatus');
			handleStatus();
		};
		// ====== Web Elements ======
		const btnBackward = !vs.BtnBackward.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnBackward.isDisabled}
				onClick={doHandleBackward}
			>
				<IconBackward />
				Back
			</Button>
		) : (
			''
		);
		const btnForward = !vs.BtnForward.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnForward.isDisabled}
				onClick={doHandleForward}
			>
				<IconForward />
				Next
			</Button>
		) : (
			''
		);
		const btnShare = !vs.BtnShare.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnShare.isDisabled}
				onClick={doHandleShare}
			>
				<IconShare />
				Share
			</Button>
		) : (
			''
		);
		const btnPayment = !vs.BtnPayment.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnPayment.isDisabled}
				onClick={doHandlePayment}
			>
				<IconPayment />
				Pay
			</Button>
		) : (
			''
		);
		const btnJoin = !vs.BtnJoin.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnJoin.isDisabled}
				onClick={doHandleJoin}
			>
				<IconPersonAdd />
				Join
			</Button>
		) : (
			''
		);
		const btnLeave = !vs.BtnLeave.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnLeave.isDisabled}
				onClick={doHandleLeave}
			>
				<IconPersonAddUndo />
				Leave
			</Button>
		) : (
			''
		);
		const btnLock = !vs.BtnLock.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnLock.isDisabled}
				onClick={doHandleLock}
			>
				<IconLock />
				Lock
			</Button>
		) : (
			''
		);
		const btnStatus = !vs.BtnStatus.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnStatus.isDisabled}
				onClick={doHandleStatus}
			>
				<IconStatus />
				Status
			</Button>
		) : (
			''
		);

		return (
			<AppBar position="fixed" color="default" className={classes.appBar}>
				<Toolbar className={classes.toolbar}>
					{btnBackward}
					{btnShare}
					{btnPayment}
					{btnLock}
					{btnJoin}
					{btnLeave}
					{btnStatus}
					{btnForward}
				</Toolbar>
			</AppBar>
		);
	}
}

export default withStyles(styles, { withTheme: true })(BotFooter);
