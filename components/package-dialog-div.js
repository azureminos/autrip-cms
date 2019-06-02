import _ from 'lodash';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const styles = theme => ({
	paper: {
		position: 'absolute',
		width: theme.spacing.unit * 100,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		outline: 'none',
	},
	mobileView: {
		height: '700px',
	},
});

class PackageDialog extends React.Component {
	render () {
		const { classes, open, handleClose } = this.props;

		return (
			<div>
				<Dialog
					open={!!open}
					onClose={handleClose}
				>
					<DialogContent className={classes.mobileView}>
						{this.props.children}
					</DialogContent>
					<DialogActions>
					<Button onClick={handleClose} color="primary">
						Close
					</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default withStyles(styles)(PackageDialog);
