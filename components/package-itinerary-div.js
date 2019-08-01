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
	activityBlock: {
		margin: 8,
	},
	activityImage: {
		width: '500px',
		borderRadius: '10px 10px 0 0',
	},
	hotelBlock: {
		margin: 8,
	},
	hotelImage: {
		width: '500px',
		borderRadius: '10px 10px 0 0',
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
		const itItems = _.groupBy(items, item => {
			return item.dayNo;
		});
		const itHotels = _.groupBy(hotels, hotel => {
			return hotel.dayNo;
		});

		const result = _.map(Object.keys(itItems), key => {
			const item = {};
			item.activities = itItems[key];
			item.hotel
				= itHotels[key] && itHotels[key].length > 0 ? itHotels[key][0] : {};
			return item;
		});
		console.log('>>>>PackageItinerary.getItinerary', result);
		return result;
	}
	// Render day activities
	renderActivity (activities, classes) {
		if (
			!activities
			|| activities.length === 0
			|| (activities.length === 1 && !activities[0].attraction)
		) {
			return (
				<div>
					<h3>Activity</h3>
					<div>No activity planned.</div>
				</div>
			);
		} else {
			const listActivities = _.map(activities, a => {
				return (
					<div key={a.id}>
						<h4>Activity {a.daySeq}</h4>
						<div className={classes.container}>
							<Grid container spacing={8}>
								<Grid item xs className={classes.activityBlock}>
									<Grid item xs>
										<TextField
											id="activity-name"
											label="Name"
											value={String(a.attraction.name)}
											className={classes.textField}
											margin="normal"
											InputProps={{ readOnly: true }}
										/>
									</Grid>
									<Grid item xs>
										<TextField
											id="activity-description"
											label="Description"
											value={a.description}
											className={classes.textField}
											multiline
											rowsMax="3"
											margin="normal"
											InputProps={{ readOnly: true }}
										/>
									</Grid>
									<Grid item xs>
										<TextField
											id="activity-total-time"
											label="Total Hours"
											value={String(a.timePlannable)}
											className={classes.textField}
											margin="normal"
											InputProps={{ readOnly: true }}
										/>
									</Grid>
									<Grid item xs>
										<TextField
											id="activity-visit-hours"
											label="Activity Visit Hours"
											value={String(a.attraction.timeVisit)}
											className={classes.textField}
											margin="normal"
											InputProps={{ readOnly: true }}
										/>
									</Grid>
									<Grid item xs>
										<TextField
											id="activity-traffic-hours"
											label="Activity Traffic Hours"
											value={String(a.attraction.timeTraffic)}
											className={classes.textField}
											margin="normal"
											InputProps={{ readOnly: true }}
										/>
									</Grid>
								</Grid>
								<Grid item xs className={classes.activityBlock}>
									<img
										src={a.attraction.imageUrl}
										alt="Avatar"
										className={classes.activityImage}
									/>
								</Grid>
							</Grid>
						</div>
					</div>
				);
			});
			return (
				<div>
					<h3>Activity</h3>
					<div>{listActivities}</div>
				</div>
			);
		}
	}
	// Render hotel
	renderHotel (hotel, classes) {
		if (hotel && hotel.hotel) {
			return (
				<div>
					<h3>Hotel</h3>
					<div className={classes.container}>
						<Grid container spacing={8}>
							<Grid item xs className={classes.hotelBlock}>
								<Grid item xs>
									<TextField
										id="hotel-name"
										label="Name"
										value={String(hotel.hotel.name)}
										className={classes.textField}
										margin="normal"
										InputProps={{ readOnly: true }}
									/>
								</Grid>
								<Grid item xs>
									<TextField
										id="hotel-stars"
										label="Stars"
										value={hotel.hotel.stars}
										className={classes.textField}
										margin="normal"
										InputProps={{ readOnly: true }}
									/>
								</Grid>
								<Grid item xs>
									<TextField
										id="hotel-type"
										label="Type"
										value={hotel.hotel.type}
										className={classes.textField}
										margin="normal"
										InputProps={{ readOnly: true }}
									/>
								</Grid>
							</Grid>
							<Grid item xs className={classes.hotelBlock}>
								<img
									src={hotel.hotel.imageUrl}
									alt="Avatar"
									className={classes.hotelImage}
								/>
							</Grid>
						</Grid>
					</div>
				</div>
			);
		}
		return (
			<div>
				<h3>Hotel</h3>
				<div>Overnight stay is not needed.</div>
			</div>
		);
	}
	// Render itinerary
	renderItinerary (itinerary, classes, selectedTab) {
		const tabItems = [];
		_.each(itinerary, (it, idx) => {
			const tabName = `Day ${idx + 1}`;
			tabItems.push(<Tab key={idx} label={tabName} />);
		});
		const tabContainer = itinerary[selectedTab] ? (
			<TabContainer>
				{this.renderActivity(itinerary[selectedTab].activities, classes)}
				{this.renderHotel(itinerary[selectedTab].hotel, classes)}
			</TabContainer>
		) : (
			<TabContainer>Undefined</TabContainer>
		);
		return (
			<div className={classes.root}>
				<Tabs
					value={selectedTab}
					onChange={this.handleTabChange}
					variant="fullWidth"
				>
					{tabItems}
				</Tabs>
				{tabContainer}
			</div>
		);
	}

	/* ----------  Event Handlers  ------- */
	handleTabChange (event, value) {
		this.setState({ selectedTab: value });
	}

	render () {
		// console.log('>>>>PackageItinerary.render >> packageItems', this.props.packageItems);
		// console.log('>>>>PackageItinerary.render >> packageHotels', this.props.packageHotels);
		const { classes, theme, packageItems, packageHotels } = this.props;
		const { selectedTab } = this.state;
		const itinerary = this.getItinerary(packageItems, packageHotels);

		return this.renderItinerary(itinerary, classes, selectedTab);
	}
}

export default withStyles(styles, { withTheme: true })(PackageItinerary);
