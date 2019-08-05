import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: '100%',
	},
});

class PackageSummary extends React.Component {
	constructor (props) {
		super(props);

		// this.getNextState = this.getNextState.bind(this);

		this.state = {
			updating: false,
		};
	}

	/* ----------  Helpers  ------- */

	/* ----------  Event Handlers  ------- */

	render () {
		console.log('>>>>PackageSummary.render', this.props.packageSummary);
		const { classes, theme, packageSummary } = this.props;

		return (
			<div className={classes.container}>
				<Grid container spacing={8}>
					<TextField
						id="package-summary-name"
						label="Name"
						defaultValue={packageSummary.name}
						className={classes.textField}
						margin="normal"
						InputProps={{ readOnly: true }}
					/>
				</Grid>
				<Grid container spacing={8}>
					<Grid item xs>
						<TextField
							id="package-summary-max-participants"
							label="Max Participants"
							defaultValue={String(packageSummary.maxParticipant)}
							className={classes.textField}
							margin="normal"
							InputProps={{ readOnly: true }}
						/>
					</Grid>
					<Grid item xs>
						<TextField
							id="package-summary-effective-from"
							label="Effective From"
							defaultValue={packageSummary.effectiveFrom.substring(
								0,
								packageSummary.effectiveFrom.indexOf('T')
							)}
							className={classes.textField}
							margin="normal"
							InputProps={{ readOnly: true }}
						/>
					</Grid>
					<Grid item xs>
						<TextField
							id="package-summary-effective-to"
							label="Effective To"
							defaultValue={packageSummary.effectiveTo.substring(
								0,
								packageSummary.effectiveTo.indexOf('T')
							)}
							className={classes.textField}
							margin="normal"
							InputProps={{ readOnly: true }}
						/>
					</Grid>
					<Grid item xs>
						<TextField
							id="package-summary-is-customisable"
							label="Customisable"
							defaultValue={String(packageSummary.isCustomisable)}
							className={classes.textField}
							margin="normal"
							InputProps={{ readOnly: true }}
						/>
					</Grid>
					<Grid item xs>
						<TextField
							id="package-summary-is-extension"
							label="Extension"
							defaultValue={String(packageSummary.isExtention)}
							className={classes.textField}
							margin="normal"
							InputProps={{ readOnly: true }}
						/>
					</Grid>
					<Grid item xs>
						<TextField
							id="package-summary-is-promoted"
							label="On Sale"
							defaultValue={String(packageSummary.isPromoted)}
							className={classes.textField}
							margin="normal"
							InputProps={{ readOnly: true }}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={8}>
					<TextField
						id="package-summary-description"
						label="Description"
						defaultValue={packageSummary.description}
						className={classes.textField}
						multiline
						rowsMax="3"
						margin="normal"
						InputProps={{ readOnly: true }}
					/>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PackageSummary);
