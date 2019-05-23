import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

function getModalStyle () {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const styles = theme => ({
	paper: {
		position: 'absolute',
		width: theme.spacing.unit * 100,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		outline: 'none',
	},
});

class PackageModal extends React.Component {
	render () {
		const { classes, open, handleClose } = this.props;

		return (
			<div>
				<Modal
					aria-labelledby="modal-title"
					aria-describedby="simple-modal-description"
					open={!!open}
					onClose={handleClose}
				>
					<div style={getModalStyle()} className={classes.paper}>
						{this.props.children}
					</div>
				</Modal>
			</div>
		);
	}
}

PackageModal.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PackageModal);
