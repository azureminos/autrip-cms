import _ from 'lodash';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import IconBackward from '@material-ui/icons/ArrowBack';
import IconForward from '@material-ui/icons/ArrowForward';
import IconShare from '@material-ui/icons/Share';
import IconPayment from '@material-ui/icons/Payment';
import IconPersonAdd from '@material-ui/icons/PersonAdd';
import IconPersonAddUndo from '@material-ui/icons/Undo';
import IconLock from '@material-ui/icons/Lock';
import IconUnlock from '@material-ui/icons/LockOpen';
import IconStatus from '@material-ui/icons/TrackChanges';
import IconCustomise from '@material-ui/icons/Ballot';
import IconCancelCustomise from '@material-ui/icons/Cancel';
import CONSTANTS from '../../../lib/constants';

const { Instance } = CONSTANTS.get();

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

const calcVisibility = ({ instPackage, instPackageExt }) => {
	const vs = {
		BtnBackward: { isHidden: true, isDisabled: false },
		BtnForward: { isHidden: true, isDisabled: false },
		BtnShare: { isHidden: true, isDisabled: false },
		BtnJoin: { isHidden: true, isDisabled: false },
		BtnLeave: { isHidden: true, isDisabled: false },
		BtnLock: { isHidden: true, isDisabled: false },
		BtnUnlock: { isHidden: true, isDisabled: false },
		BtnStatus: { isHidden: true, isDisabled: false },
		BtnCustomise: { isHidden: true, isDisabled: false },
		BtnCancelCustomise: { isHidden: true, isDisabled: false },
		BtnPayment: { isHidden: true, isDisabled: false },
	};
	// Logic starts here
	if (!instPackage.isCustomised) {
		if (instPackageExt.isOwner) {
			if (instPackage.status === Instance.status.INITIATED) {
				vs.BtnShare.isHidden = false;
				vs.BtnCustomise.isHidden = !instPackage.isCustomisable;
				vs.BtnLock.isHidden = false;
			} else if (instPackage.status === Instance.status.PENDING_PAYMENT) {
				vs.BtnUnlock.isHidden = false;
				vs.BtnPayment.isHidden = false;
			} else {
				vs.BtnStatus.isHidden = false;
			}
		} else {
			if (instPackage.status === Instance.status.INITIATED) {
				vs.BtnShare.isHidden = false;
				vs.BtnJoin.isHidden = !instPackageExt.isJoined;
				vs.BtnLeave.isHidden = instPackageExt.isJoined;
			} else if (instPackage.status === Instance.status.PENDING_PAYMENT) {
				vs.BtnStatus.isHidden = false;
			} else {
				vs.BtnShare.isHidden = false;
			}
		}
	} else {
		if (instPackageExt.isOwner) {
			if (
				instPackage.status === Instance.status.INITIATED
				|| instPackage.status === Instance.status.SELECT_ATTRACTION
			) {
				vs.BtnForward.isHidden = false;
				vs.BtnCancelCustomise.isHidden = false;
				vs.BtnShare.isHidden = false;
			} else if (instPackage.status === Instance.status.SELECT_HOTEL) {
				vs.BtnBackward.isHidden = false;
				vs.BtnForward.isHidden = false;
				vs.BtnShare.isHidden = false;
				vs.BtnCancelCustomise.isHidden = false;
			} else if (instPackage.status === Instance.status.REVIEW_ITINERARY) {
				vs.BtnBackward.isHidden = false;
				vs.BtnLock.isHidden = false;
				vs.BtnShare.isHidden = false;
				vs.BtnCancelCustomise.isHidden = false;
			} else if (instPackage.status === Instance.status.PENDING_PAYMENT) {
				vs.BtnUnlock.isHidden = false;
				vs.BtnPayment.isHidden = false;
			} else if (instPackage.status === Instance.status.DEPOSIT_PAID) {
				vs.BtnShare.isHidden = false;
				vs.BtnStatus.isHidden = false;
			} else {
				vs.BtnShare.isHidden = false;
			}
		} else {
			if (!instPackageExt.statusMember || !instPackageExt.people) {
				vs.BtnJoin.isHidden = false;
			} else if (
				instPackage.status === Instance.status.INITIATED
				|| instPackage.status === Instance.status.SELECT_ATTRACTION
				|| instPackage.status === Instance.status.SELECT_HOTEL
				|| instPackage.status === Instance.status.REVIEW_ITINERARY
			) {
				vs.BtnShare.isHidden = false;
				vs.BtnStatus.isHidden = false;
				vs.BtnLeave.isHidden = false;
			} else if (instPackage.status === Instance.status.PENDING_PAYMENT) {
				vs.BtnShare.isHidden = false;
				vs.BtnStatus.isHidden = false;
			} else if (instPackage.status === Instance.status.DEPOSIT_PAID) {
				vs.BtnShare.isHidden = false;
				vs.BtnStatus.isHidden = false;
				vs.BtnPayment.isHidden = false;
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
		const { classes, instPackage, instPackageExt, rates, actions } = this.props;
		const {
			handleBackward,
			handleForward,
			handleShare,
			handleJoin,
			handleLeave,
			handleLock,
			handleUnlock,
			handleStatus,
			handleCustomise,
			handleCancelCustomise,
			handlePay,
		} = actions;
		const vs = calcVisibility({ instPackage, instPackageExt });
		// ====== Event Handler ======
		const doHandleBackward = () => {
			console.log('>>>>BotFooter.doHandleBackward');
			if (handleBackward) handleBackward(rates);
		};
		const doHandleForward = () => {
			console.log('>>>>BotFooter.doHandleForward');
			if (handleForward) handleForward(rates);
		};
		const doHandleShare = () => {
			console.log('>>>>BotFooter.doHandleShare');
			if (handleShare) handleShare();
		};
		const doHandlePay = () => {
			console.log('>>>>BotFooter.doHandlePay');
			if (handlePay) handlePay();
		};
		const doHandleJoin = () => {
			console.log('>>>>BotFooter.doHandleJoin');
			if (handleJoin) handleJoin();
		};
		const doHandleLeave = () => {
			console.log('>>>>BotFooter.doHandleLeave');
			if (handleLeave) handleLeave();
		};
		const doHandleLock = () => {
			console.log('>>>>BotFooter.doHandleLock');
			if (handleLock) handleLock();
		};
		const doHandleUnlock = () => {
			console.log('>>>>BotFooter.doHandleUnlock');
			if (handleUnlock) handleUnlock();
		};
		const doHandleStatus = () => {
			console.log('>>>>BotFooter.doHandleStatus');
			if (handleStatus) handleStatus();
		};
		const doHandleCustomise = () => {
			console.log('>>>>BotFooter.doHandleCustomise');
			if (handleCustomise) handleCustomise();
		};
		const doHandleCancelCustomise = () => {
			console.log('>>>>BotFooter.doHandleCancelCustomise');
			if (handleCancelCustomise) handleCancelCustomise();
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
				onClick={doHandlePay}
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
		const btnUnlock = !vs.BtnUnlock.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnUnlock.isDisabled}
				onClick={doHandleUnlock}
			>
				<IconUnlock />
				UnLock
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
		const btnCustomise = !vs.BtnCustomise.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnCustomise.isDisabled}
				onClick={doHandleCustomise}
			>
				<IconCustomise />
				Start DIY
			</Button>
		) : (
			''
		);
		const btnCancelCustomise = !vs.BtnCancelCustomise.isHidden ? (
			<Button
				classes={{ root: classes.button, label: classes.label }}
				variant="contained"
				disableRipple={true}
				disabled={vs.BtnCancelCustomise.isDisabled}
				onClick={doHandleCancelCustomise}
			>
				<IconCancelCustomise />
				Cancel DIY
			</Button>
		) : (
			''
		);

		return (
			<AppBar position="fixed" color="default" className={classes.appBar}>
				<Toolbar className={classes.toolbar}>
					{btnBackward}
					{btnShare}
					{btnCustomise}
					{btnCancelCustomise}
					{btnLock}
					{btnUnlock}
					{btnPayment}
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
