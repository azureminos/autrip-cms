import _ from 'lodash';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid, Modal, Button } from '@material-ui/core';

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
	button: {
		width: '100%',
	},
});

class BotModal extends React.Component {
	render () {
		const {
			classes,
			buttons,
			title,
			description,
			contents,
			isModalOpen,
			handleModalClose,
		} = this.props;
		const dButtons = _.map(buttons, b => {
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
		return (
			<div>
				<Modal open={isModalOpen} onClose={() => handleModalClose()}>
					<div className={classes.paper}>
						<Typography variant="h6" id="modal-title">
							{title}
						</Typography>
						<div>
							<Typography variant="subtitle1" id="simple-modal-description">
								{description}
							</Typography>
							{contents ? contents : ''}
						</div>
						<Grid container>{dButtons}</Grid>
					</div>
				</Modal>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(BotModal);
