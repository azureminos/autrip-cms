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
	
		this.state = {
		  idxSelected: 0,
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
	getPackageDetails(pkg) {
		console.log('>>>>App Client >> getPackageDetails', pkg);
		this.pushToRemote('package:get', {id: pkg.id});
		this.setState({ updating: true });
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
		socket.on('package:get', (res) => { console.log('>>>>Event[package:get] response', res); })
	}

	handleDrawerItemClick = (idx) => {
		//Add here for logics to update state
		this.setState({ idxSelected: idx });
	};

	render() {
		const { packages, filters, drawerItems } = this.props;
		const { updating, idxSelected } = this.state;
		let page;
		//Init tab content to display all packages

		//Init tab content to display all attractions
		const divPackageCards = (
			<PackageSection
				packages={packages}
				filters={filters}
				getPackageDetails={this.getPackageDetails}
			/>
		);
		
		//Init page
		page = (
			<Paper>
				<PersistentDrawer
					drawerItems={drawerItems}
					selectedDrawerItem={idxSelected}
					handleDrawerItemClick={this.handleDrawerItemClick}
				>
					{idxSelected === 0 && divPackageCards}
					{idxSelected === 1 && <div>This is Country</div>}
					{idxSelected === 2 && <div>This is City</div>}
					{idxSelected === 3 && <div>This is Attraction</div>}
					{idxSelected === 4 && <div>This is Hotel</div>}
				</PersistentDrawer>
			</Paper >
		);

		return (page);
	};
}

export default App;
