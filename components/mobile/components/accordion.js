import React, { createElement } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import scrollToComponent from 'react-scroll-to-component';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

let scrollToComponent;

const styles = theme => ({
	root: {
		width: '100%',
	},
	heading: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightRegular,
	},
	accodionTitleText: {
		float: 'left',
		paddingRight: 8,
	},
	accodionTitleIcon: {
		float: 'right',
		margin: 4,
	},
	accodionSummary: {
		display: 'flex',
		alignItems: 'center',
	},
});

const ExpansionPanelSummary = withStyles(theme => ({
	root: {
		padding: theme.spacing.unit,
	},
}))(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
	root: {
		padding: theme.spacing.unit,
	},
}))(MuiExpansionPanelDetails);

class ControlledAccordion extends React.Component {
	constructor(props) {
		super(props);
		this.scrollMap = {};
		const panelMap = {};
		const titles = _.keys(props.mapContents);
		_.forEach(titles, title => {
			this.scrollMap[title] = React.createRef();
			panelMap[title] = true;
		});

		this.state = {
			clicked: 0,
			panelMap: panelMap,
		};

		this.scrollToContent.bind(this);
	}

	scrollToContent = panel => {
		//this.scrollMap[panel].current.scrollIntoView({block: 'start', behavior: 'smooth'});
		scrollToComponent(this.scrollMap[panel]);
	};

	handleChange = panel => (event, expanded) => {
		console.log('>>>>ControlledAccordion, handleChange()', {
			panel: panel,
			expanded: expanded,
		});
		const that = this;
		const { panelMap } = that.state;
		const clicked = that.state.clicked + 1;
		panelMap[panel] = !panelMap[panel];
		that.setState({
			panelMap: panelMap,
			clicked: clicked,
		});

		if (expanded) {
			setTimeout(
				function() {
					this.scrollToContent(panel);
				}.bind(that),
				500
			);
		}
	};

	componentDidMount() {
		scrollToComponent = require('react-scroll-to-component');
	}

	render() {
		console.log('>>>>ControlledAccordion, start render()', {
			props: this.props,
			state: this.state,
		});
		const { classes, mapContents } = this.props;
		const { panelMap } = this.state;
		const accordions = [];

		_.forEach(_.keys(mapContents), title => {
			const panel = (
				<div
					key={title}
					ref={section => {
						this.scrollMap[title] = section;
					}}
					className={classes.root}
				>
					<ExpansionPanel
						expanded={panelMap[title]}
						onChange={this.handleChange(title)}
					>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							classes={{ content: classes.accodionSummary }}
						>
							<Typography className={classes.accodionTitleText} variant="h5">
								{title}
							</Typography>
							<Fab
								size="small"
								color="secondary"
								aria-label="add"
								className={classes.accodionTitleIcon}
							>
								<AddIcon />
							</Fab>
							<Fab
								size="small"
								color="secondary"
								aria-label="delete"
								className={classes.accodionTitleIcon}
							>
								<DeleteIcon />
							</Fab>
							<Fab
								size="small"
								color="secondary"
								aria-label="edit"
								className={classes.accodionTitleIcon}
								style={{ padding: '0px' }}
							>
								<EditIcon />
							</Fab>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>{mapContents[title]}</ExpansionPanelDetails>
					</ExpansionPanel>
				</div>
			);
			accordions.push(panel);
		});

		return <div>{accordions}</div>;
	}
}

ControlledAccordion.propTypes = {
	mapContents: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ControlledAccordion);
