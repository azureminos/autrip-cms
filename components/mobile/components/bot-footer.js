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
import CONSTANTS from '../../../lib/constants';

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

const calcVisibility = input => {
	const { instPackage, steps } = input;
	const step = instPackage.step || 0;

	const vs = {
		BtnBackward: { isHidden: true, isDisabled: false },
		BtnForward: { isHidden: true, isDisabled: false },
		BtnShare: { isHidden: true, isDisabled: false },
		BtnPayment: { isHidden: true, isDisabled: false },
		BtnJoin: { isHidden: true, isDisabled: false },
		BtnLeave: { isHidden: true, isDisabled: false },
		BtnLock: { isHidden: true, isDisabled: false },
	};

	// Default visibility
	vs.BtnBackward.isHidden = false;
	vs.BtnForward.isHidden = false;
	vs.BtnShare.isHidden = false;
	// Logic starts here
	vs.BtnBackward.isDisabled = step === 0;
	vs.BtnForward.isDisabled = step === steps.length - 1;
	vs.BtnPayment.isHidden = step !== steps.length - 1;

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
		const {
			classes,
			// isCustomised,
			// isOwner,
			// isJoined,
			instPackage,
			handleBackward,
			handleForward,
			handleShare,
			handlePayment,
			handleJoin,
			handleLeave,
			handleLock,
		} = this.props;
		const steps = instPackage.isCustomised ? diy : regular;
		const vs = calcVisibility({ instPackage, steps });
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

		return (
			<AppBar position="fixed" color="default" className={classes.appBar}>
				<Toolbar className={classes.toolbar}>
					{btnBackward}
					{btnShare}
					{btnPayment}
					{btnLock}
					{btnForward}
				</Toolbar>
			</AppBar>
		);
	}
}

export default withStyles(styles, { withTheme: true })(BotFooter);
