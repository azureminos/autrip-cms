import _ from 'lodash';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const styles = theme => ({
	paper: {
		overflowY: 'hidden',
	},
	mobileView: {
		width: 580,
		height: 800,
	},
});

class PackageDialog extends React.Component {
	render () {
		const { classes, open, handleClose } = this.props;

		return (
			<div>
				<Dialog
					scroll={'paper'}
					open={!!open}
					onClose={handleClose}
					classes={{ paper: classes.paper }}
				>
					<DialogContent className={classes.mobileView}>
						{this.props.children}
					</DialogContent>
				</Dialog>
			</div>
		);
	}
}

export default withStyles(styles)(PackageDialog);
