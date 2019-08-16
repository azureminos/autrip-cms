import React from 'react';
import { FadeLoader } from 'react-spinners';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	container: {
		position: 'relative',
	},
	centeredElement: {
		height: 100,
		width: 100,
		position: 'absolute',
		left: '50%',
		marginLeft: -50,
		top: '20%',
		marginTop: -50,
	},
});

class LoadingSpinner extends React.Component {
	render () {
		const { classes } = this.props;
		return (
			<div className={classes.container}>
				<div className={classes.centeredElement}>
					<FadeLoader
						sizeUnit={'px'}
						height={50}
						width={15}
						radius={50}
						color={'rgb(54, 215, 183)'}
						loading={this.props.loading}
					/>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(LoadingSpinner);
