import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green, red, grey } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

const styles = {
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: red[600],
	},
	info: {
		backgroundColor: grey[600],
	},
	warning: {
		backgroundColor: amber[600],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: 8,
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
};

function MySnackbarContentWrapper (props) {
	const { message, onClose, variant, classes } = props;
	const Icon = variantIcon[variant];

	return (
		<SnackbarContent
			className={classes[variant]}
			aria-describedby="client-snackbar"
			message={
				<span id="client-snackbar" className={classes.message}>
					<Icon className={clsx(classes.icon, classes.iconVariant)} />
					{message}
				</span>
			}
			action={[
				<IconButton
					key="close"
					aria-label="close"
					color="inherit"
					onClick={onClose}
				>
					<CloseIcon className={classes.icon} />
				</IconButton>,
			]}
		/>
	);
}

MySnackbarContentWrapper.propTypes = {
	onClose: PropTypes.func,
};

class CustomizedSnackbars extends React.Component {
	constructor (props) {
		super(props);

		this.closeHandler = this.closeHandler.bind(this);

		this.state = {
			open: true,
		};
	}

	/* ----------  Helpers  ------- */
	/* ----------  Event Handlers  ------- */
	closeHandler (event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		this.props.handleClose();
		this.state.open = false;
	}

	render () {
		const { classes, message } = this.props;
		const variant = message.err ? 'error' : 'success';

		return (
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={this.state.open}
				autoHideDuration={4000}
				onClose={this.closeHandler}
			>
				<MySnackbarContentWrapper
					onClose={this.closeHandler}
					variant={variant}
					message={message.message}
					classes={classes}
				/>
			</Snackbar>
		);
	}
}

export default withStyles(styles, { withTheme: true })(CustomizedSnackbars);
