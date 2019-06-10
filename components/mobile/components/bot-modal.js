import _ from 'lodash';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

const styles = theme => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		padding: 4,
		outline: 'none',
		top: '50%',
		left: '50%',
		transform: `translate(-50%, -50%)`,
	},
});

class BotModal extends React.Component {
	render () {
		const { classes, buttons, title, description, isModalOpen, handleModalClose } = this.props;
		const dButtons = _.map(buttons, (b) => {
			return (<Button key={b.title} onClick={() => { b.handleClick(); }}>{b.title}}</Button>);
		});
		return (
			<div>
				<Modal open={isModalOpen} onClose={() => handleModalClose()}>
					<div className={classes.paper}>
						<Typography variant="h6" id="modal-title">{title}</Typography>
						<Typography variant="subtitle1" id="simple-modal-description">{description}</Typography>
						{dButtons}
					</div>
				</Modal>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(BotModal);
