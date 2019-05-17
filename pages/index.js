import { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import io from 'socket.io-client';
import { Paper, Typography } from '@material-ui/core';
import PackageSection from '../components/package-section';
import PersistentDrawer from '../components/persistent-drawer';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
let socket;

class App extends Component {

	static async getInitialProps() {
		const urlGetPackages = `${process.env.API_BASE_URL}/api/travelpackage`;
		let resPackages = await axios.get(urlGetPackages);

		const urlGetMetadata = `${process.env.API_BASE_URL}/api/metadata`;
		let resMetadata = await axios.get(urlGetMetadata);

		const drawerItems = ['Package', 'Country', 'City', 'Attraction', 'Hotel'];

		return { drawerItems, packages: resPackages.data, filters: resMetadata.data };
	}

	constructor(props) {
		super(props);

		this.getPackageDetails = this.getPackageDetails.bind(this);
		this.updatePackageState = this.updatePackageState.bind(this);

		this.state = {
			idxSelectedSection: 0,
			packages: props.packages ? props.packages : [],
			updating: false,
		};
	}

	/* ==============================
     = Helper Methods             =
     ============================== */

	/* ----------  Communicate with Server  ---------- */
	pushToRemote(channel, message) {
		console.log(`>>>>Push event[${channel}] with message`, message);
		this.setState({ updating: true }); // Set the updating spinner
		socket.emit(
			`push:${channel}`,
			message,
			(status) => {
				// Finished successfully with a special 'ok' message from socket server
				if (status !== 'ok') {
					console.error(
						`Problem pushing to ${channel}`,
						JSON.stringify(message)
					);
				}

				this.setState({
					updating: false, // Turn spinner off
				});
			}
		);
	}

	/* ==============================
	 = State & Event Handlers     =
	 ============================== */

	/* ----------  Package  ------- */
	// Get package details, Event[push:package:get]
	getPackageDetails(id) {
		console.log('>>>>App Client >> getPackageDetails', id);
		this.pushToRemote('package:get', { id: id });
		this.setState({ updating: true });
	}
	// Handle response of Get package details, Event[package:get]
	handleGetPackageDetails(res) {
		console.log('>>>>Event[package:get] response', res);
		this.setState({ updating: false });
	}
	// Update package state, Event[push:package:status]
	updatePackageState(req) {
		console.log('>>>>App Client >> updatePackageState', req);
		this.pushToRemote('package:status', req);
		this.setState({ updating: true });
	}
	// Handle response of Update package state, Event[package:status]
	handleUpdatePackageState(res) {
		console.log('>>>>Event[package:status] response', res);
		this.setState({ updating: false, packages: res.packages });
	}

	/* ==============================
     = React Lifecycle              =
     ============================== */

	// connect to WS server and listen event
	componentDidMount() {
		const socketUrl = publicRuntimeConfig.SOCKET_URL;
		console.log('>>>>App.SOCKET_URL', socketUrl);
		socket = io(socketUrl);

		//Register socket listeners
		socket.on('package:get', (res) => { this.handleGetPackageDetails(res); });
		socket.on('package:status', (res) => { this.handleUpdatePackageState(res); });
	}

	handleDrawerItemClick = (idx) => {
		//Add here for logics to update state
		this.setState({ idxSelectedSection: idx });
	};

	render() {
		const { filters, drawerItems } = this.props;
		const { updating, idxSelectedSection, packages } = this.state;
		let page;
		//Init tab content to display all packages

		//Init tab content to display all attractions
		const divPackageCards = (
			<PackageSection
				packages={packages}
				filters={filters}
				getPackageDetails={this.getPackageDetails}
				updatePackageState={this.updatePackageState}
			/>
		);

		//Init page
		page = (
			<Paper>
				<PersistentDrawer
					drawerItems={drawerItems}
					selectedDrawerItem={idxSelectedSection}
					handleDrawerItemClick={this.handleDrawerItemClick}
				>
					{idxSelectedSection === 0 && divPackageCards}
					{idxSelectedSection === 1 && <div>This is Country</div>}
					{idxSelectedSection === 2 && <div>This is City</div>}
					{idxSelectedSection === 3 && <div>This is Attraction</div>}
					{idxSelectedSection === 4 && <div>This is Hotel</div>}
				</PersistentDrawer>
			</Paper >
		);

		return (page);
	};
}

export default App;
