import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
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

function TabContainer (props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

class PackageItinerary extends React.Component {
	constructor (props) {
		super(props);

		this.handleTabChange = this.handleTabChange.bind(this);

		this.state = {
			updating: false,
			selectedTab: 0,
		};
	}

	/* ----------  Helpers  ------- */
	// Format itinerary from package items and hotels
	getItinerary (items, hotels) {
		const itinerary = [];
		const itItems = _.groupBy(items, (item) => {
			return item.dayNo;
		});

		_.each(Object.keys(itItems), (key) => {
			itinerary[Number(key) - 1] = {
				activities: itItems[key],
				hotel: hotels[Number(key) - 1],
			};
		});
		console.log('>>>>PackageItinerary.getItinerary', itinerary);
		return itinerary;
	}
	// Render day activities
	renderActivity (activities) {
		if (!activities || activities.length === 0 || (activities.length === 1 && !activities[0].attraction)) {
			return (<div>No activity planned.</div>);
		}

		return (<div>Activity List</div>);
	}
	// Render hotel
	renderHotel (hotel) {
		if (hotel.hotel) {
			return (<div>Hotel</div>);
		}
		return (<div>Overnight stay is not needed.</div>);
	}
	// Render itinerary
	renderItinerary (itinerary, classes, selectedTab) {
		const tabItems = [];
		_.each(itinerary, (it, idx) => {
			const tabName = `Day ${idx + 1}`;
			tabItems.push(<Tab key={idx} label={tabName} />);
		});
		return (
			<div className={classes.root}>
				<Tabs value={selectedTab} onChange={this.handleTabChange} variant="fullWidth">
					{tabItems}
				</Tabs>
				<TabContainer>
					{this.renderActivity(itinerary[selectedTab].activities)}
					{this.renderHotel(itinerary[selectedTab].hotel)}
				</TabContainer>
			</div>
		);
	}

	/* ----------  Event Handlers  ------- */
	handleTabChange (event, value) {
		this.setState({ selectedTab: value });
	};

	render () {
		console.log('>>>>PackageItinerary.render >> packageItems', this.props.packageItems);
		console.log('>>>>PackageItinerary.render >> packageHotels', this.props.packageHotels);
		const { classes, theme, packageItems, packageHotels } = this.props;
		const { selectedTab } = this.state;
		const itinerary = this.getItinerary(packageItems, packageHotels);

		return (this.renderItinerary(itinerary, classes, selectedTab));
	}
}

export default withStyles(styles, { withTheme: true })(PackageItinerary);
