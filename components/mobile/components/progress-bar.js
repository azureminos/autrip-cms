import _ from 'lodash';
import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles } from '@material-ui/core/styles';
import CONSTANTS from '../../../lib/constants';

const { diy, regular } = CONSTANTS.get().Steps;

const styles = theme => ({
	root: {
		width: '100%',
	},
});

class ProgressBar extends React.Component {
	constructor (props) {
		console.log('>>>>ProgressBar.constructor', props);
		super(props);
		// Set initial state
		this.state = {};
	}

	render () {
		console.log('>>>>ProgressBar.render', this.state);
		const { classes, step, isCustomised, isOwner } = this.props;
		const steps = isCustomised && isOwner ? diy : regular;
		// ====== Event Handler ======

		return (
			<div className={classes.root}>
				<Stepper activeStep={step} alternativeLabel>
					{steps.map(label => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(ProgressBar);
