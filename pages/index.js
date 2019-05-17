import { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import io from 'socket.io-client';
import getConfig from 'next/config';

import { Paper, Typography } from '@material-ui/core';
import PersistentDrawer from '../components/persistent-drawer';
import PackageFilters from '../components/package-filters';
import PackageCards from '../components/package-list-section';
import PackageDetails from '../components/package-item-section';

const { publicRuntimeConfig } = getConfig();
let socket;

class App extends Component {

	static async getInitialProps () {
		const urlGetPackages = `${process.env.API_BASE_URL}/api/travelpackage`;
		let resPackages = await axios.get(urlGetPackages);

		const urlGetMetadata = `${process.env.API_BASE_URL}/api/metadata`;
		let resMetadata = await axios.get(urlGetMetadata);

		const drawerItems = ['Package', 'Country', 'City', 'Attraction', 'Hotel'];

		return { drawerItems, packages: resPackages.data, filters: resMetadata.data };
	}

	constructor (props) {
		super(props);

		this.getPackageDetails = this.getPackageDetails.bind(this);
		this.getFilteredPackages = this.getFilteredPackages.bind(this);
		this.handleGetPackageDetails = this.handleGetPackageDetails.bind(this);
		this.updatePackageState = this.updatePackageState.bind(this);
		this.handleRefreshAllPackages = this.handleRefreshAllPackages.bind(this);

		this.state = {
			idxSelectedSection: 0,
			packages: props.packages ? props.packages : [],
			updating: false,
			selectedPackage: {},
		};
	}

	/* ==============================
     = Helper Methods             =
     ============================== */

	/* ----------  Communicate with Server  ---------- */
	pushToRemote (channel, message) {
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
	getPackageDetails (id) {
		console.log('>>>>App Client >> getPackageDetails', id);
		this.pushToRemote('package:get', { id: id });
		this.setState({ updating: true });
	}
	// Get package details, Event[push:package:filter]
	getFilteredPackages (req) {
		console.log('>>>>App Client >> getFilteredPackages', req);
		this.pushToRemote('package:filter', req);
		this.setState({ updating: true });
	}
	// Handle response of Get package details, Event[package:get]
	handleGetPackageDetails (res) {
		console.log('>>>>Event[package:get] response', res);
		this.setState({ updating: false, packages: [], selectedPackage: res });
	}
	// Update package state, Event[push:package:status]
	updatePackageState (req) {
		console.log('>>>>App Client >> updatePackageState', req);
		this.pushToRemote('package:status', req);
		this.setState({ updating: true });
	}
	// Handle response of refresh all packages, Event[package:refreshAll]
	handleRefreshAllPackages (res) {
		console.log('>>>>Event[package:refreshAll] response', res);
		this.setState({ updating: false, packages: res.packages, selectedPackage: {} });
	}

	/* ==============================
     = React Lifecycle              =
     ============================== */

	// connect to WS server and listen event
	componentDidMount () {
		const socketUrl = publicRuntimeConfig.SOCKET_URL;
		console.log('>>>>App.SOCKET_URL', socketUrl);
		socket = io(socketUrl);

		//Register socket listeners
		socket.on('package:get', (res) => { this.handleGetPackageDetails(res); });
		socket.on('package:refreshAll', (res) => { this.handleRefreshAllPackages(res); });
	}

	handleDrawerItemClick (idx) {
		//Add here for logics to update state
		this.setState({ idxSelectedSection: idx });
	};

	render () {
		console.log('>>>>App.render', this.props.filters);
		const { filters, drawerItems } = this.props;
		const { idxSelectedSection, packages, selectedPackage } = this.state;
		let page;

		// Init tab content to display all packages
		const divPackageCards = (
			<PackageCards
				packages={packages}
				getPackageDetails={this.getPackageDetails}
				updatePackageState={this.updatePackageState}
			/>
		);
		// Init tab content to display selected package
		const divPackageDetails = (
			<PackageDetails
				selectedPackage={selectedPackage}
				updatePackageState={this.updatePackageState}
				getFilteredPackages={this.getFilteredPackages}
			/>
		);

		// Init toolbar items (filters, search, ...)
		const toolbarItem = (
			(idxSelectedSection === 0 && (
				<PackageFilters
					statusFilterItems={filters.status}
					getFilteredPackages={this.getFilteredPackages}
				/>))
			|| (idxSelectedSection !== 0 && (<div/>))
		);

		// Init page
		page = (
			<Paper>
				<PersistentDrawer
					drawerItems={drawerItems}
					selectedDrawerItem={idxSelectedSection}
					handleDrawerItemClick={this.handleDrawerItemClick}
					toolbarItem={toolbarItem}
				>
					{idxSelectedSection === 0 && packages.length > 0 && divPackageCards}
					{idxSelectedSection === 0 && packages.length === 0 && !!selectedPackage && divPackageDetails}
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
