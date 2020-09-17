import { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import io from 'socket.io-client';
import getConfig from 'next/config';

import { Paper, Button } from '@material-ui/core';
import Loader from 'react-loader-advanced';

import LoadingSpinner from '../components/loading-spinner';
import SnackBar from '../components/snack-bar';
import PersistentDrawer from '../components/persistent-drawer';
import PackageFilters from '../components/package-filters';
import PackageCards from '../components/package-list-section';
import PackageDetails from '../components/package-details-section';

const { publicRuntimeConfig } = getConfig();
let socket;

class App extends Component {
	static async getInitialProps () {
		const urlGetPackages = `${process.env.API_BASE_URL}/api/travelpackage/template`;
		let resPackages = await axios.get(urlGetPackages);

		const urlGetMetadata = `${process.env.API_BASE_URL}/api/metadata`;
		let resMetadata = await axios.get(urlGetMetadata);

		const drawerItems = [
			'Package',
			'Country',
			'City',
			'Attraction',
			'Hotel',
			'Support',
		];

		return {
			drawerItems,
			packages: resPackages.data,
			reference: resMetadata.data,
		};
	}

	constructor (props) {
		super(props);

		this.getPackageDetails = this.getPackageDetails.bind(this);
		this.getFilteredPackages = this.getFilteredPackages.bind(this);
		this.publishProduct = this.publishProduct.bind(this);
		this.archiveSnapshot = this.archiveSnapshot.bind(this);
		this.handleGetPackageDetails = this.handleGetPackageDetails.bind(this);
		this.handleRefreshAllPackages = this.handleRefreshAllPackages.bind(this);
		this.handlePublishProduct = this.handlePublishProduct.bind(this);
		this.handleArchiveSnapshot = this.handleArchiveSnapshot.bind(this);
		this.handleDrawerItemClick = this.handleDrawerItemClick.bind(this);
		this.handleSnackBarClose = this.handleSnackBarClose.bind(this);

		this.state = {
			updating: false,
			idxSelectedSection: 0,
			packages: props.packages ? props.packages : [],
			selectedPackage: {},
			message: null,
		};
	}

	/* ==============================
     = Helper Methods             =
     ============================== */

	/* ----------  Communicate with Server  ---------- */
	pushToRemote (channel, message) {
		console.log(`>>>>Push event[${channel}] with message`, message);
		this.setState({ updating: true }); // Set the updating spinner
		socket.emit(`push:${channel}`, message, status => {
			// Finished successfully with a special 'ok' message from socket server
			if (status !== 'ok') {
				console.error(`Problem pushing to ${channel}`, JSON.stringify(message));
			}

			this.setState({
				updating: false, // Turn spinner off
			});
		});
	}

	/* ==============================
	 = State & Event Handlers     =
	 ============================== */
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
	// Publish product, Event[push:package:publish]
	publishProduct (req) {
		console.log('>>>>App Client >> publishProduct', req);
		this.pushToRemote('package:publish', req);
		this.setState({ updating: true });
	}
	// Archive snapshot, Event[push:package:archive]
	archiveSnapshot (req) {
		console.log('>>>>App Client >> archiveSnapshot', req);
		this.pushToRemote('package:archive', req);
		this.setState({ updating: true });
	}
	// Handle response of Get package details, Event[package:get]
	handleGetPackageDetails (resp) {
		console.log('>>>>Event[package:get] response', resp);
		this.setState({ updating: false, packages: [], selectedPackage: resp });
	}
	// Handle response of refresh all packages, Event[package:refreshAll]
	handleRefreshAllPackages (resp) {
		console.log('>>>>Event[package:refreshAll] response', resp);
		this.setState({
			updating: false,
			packages: resp.packages,
			selectedPackage: {},
		});
	}
	// Handle response of publish product
	handlePublishProduct (resp) {
		console.log('>>>>Event[package:publish] response', resp);
		this.setState({ updating: false, message: resp });
	}
	// Handle response of archive snapshot
	handleArchiveSnapshot (resp) {
		console.log('>>>>Event[package:archive] response', resp);
		this.setState({ updating: false, message: resp });
	}
	// Handle drawer click
	handleDrawerItemClick (idx) {
		this.setState({ idxSelectedSection: idx });
	}
	// Handle snack bar close
	handleSnackBarClose () {
		this.setState({ message: null });
	}

	/* ==============================
     = React Lifecycle              =
     ============================== */

	// connect to WS server and listen event
	componentDidMount () {
		const socketUrl = publicRuntimeConfig.SOCKET_URL;
		console.log('>>>>App.SOCKET_URL', socketUrl);
		socket = io(socketUrl);

		// Register socket listeners
		socket.on('package:get', res => {
			this.handleGetPackageDetails(res);
		});
		socket.on('package:refreshAll', res => {
			this.handleRefreshAllPackages(res);
		});
		socket.on('package:publish', res => {
			this.handlePublishProduct(res);
		});
		socket.on('package:archive', res => {
			this.handleArchiveSnapshot(res);
		});
	}

	render () {
		const { reference, drawerItems } = this.props;
		const { idxSelectedSection, packages, selectedPackage } = this.state;
		console.log('>>>>App.render', { reference, packages, drawerItems });
		const spinner = <LoadingSpinner loading={this.state.updating} />;
		let viewPackage, viewSupport, snackBar;

		// Init Snack Bar Popup
		if (this.state.message) {
			snackBar = (
				<SnackBar
					message={this.state.message}
					handleClose={this.handleSnackBarClose}
				/>
			);
		} else {
			snackBar = '';
		}
		// Init package related view
		if (this.state.updating) {
			viewPackage = <div style={{ height: 600 }} />;
		} else {
			// Init all views
			viewSupport = <div style={{ height: 600 }} />;
			viewPackage = <div style={{ height: 600 }} />;
			// Setup view based on selection
			if (idxSelectedSection === 0) {
				if (packages && packages.length > 0) {
					// Init tab content to display all packages
					viewPackage = (
						<PackageCards
							packages={packages}
							getPackageDetails={this.getPackageDetails}
						/>
					);
				} else if (
					packages.length === 0
					&& selectedPackage
					&& selectedPackage.packageSummary
				) {
					// Init tab content to display selected package
					viewPackage = (
						<PackageDetails
							selectedPackage={selectedPackage}
							getFilteredPackages={this.getFilteredPackages}
							publishProduct={this.publishProduct}
							archiveSnapshot={this.archiveSnapshot}
						/>
					);
				} else {
					viewPackage = <div style={{ height: 600 }} />;
				}
			} else if (idxSelectedSection === 5) {
				const doRefreshReference = () => {
					console.log('>>>>Support.refreshReference() Started');
					const urlRefreshReference = '/api/func/loadReference';
					axios
						.get(urlRefreshReference)
						.then(res => {
							console.log('>>>>Support.refreshReference() Finished', res.data);
						})
						.catch(error => {
							console.log('>>>>Support.refreshReference() Error', error);
						});
				};
				viewSupport = (
					<div style={{ height: 600 }}>
						<div>
							<Button
								variant="contained"
								color="default"
								onClick={() => doRefreshReference()}
							>
								Refresh Reference
							</Button>
						</div>
					</div>
				);
			}
		}

		// Init toolbar items (reference, search, ...)
		const toolbarItem
			= (idxSelectedSection === 0 && (
				<PackageFilters
					statusFilterItems={reference.status}
					getFilteredPackages={this.getFilteredPackages}
				/>
			))
			|| (idxSelectedSection !== 0 && <div />);

		return (
			<Loader
				show={this.state.updating}
				message={spinner}
				foregroundStyle={{ color: 'white' }}
				backgroundStyle={{ backgroundColor: 'white' }}
			>
				<Paper>
					<PersistentDrawer
						drawerItems={drawerItems}
						selectedDrawerItem={idxSelectedSection}
						handleDrawerItemClick={this.handleDrawerItemClick}
						toolbarItem={toolbarItem}
					>
						{snackBar}
						{idxSelectedSection === 0 && viewPackage}
						{idxSelectedSection === 1 && <div>This is Country</div>}
						{idxSelectedSection === 2 && <div>This is City</div>}
						{idxSelectedSection === 3 && <div>This is Attraction</div>}
						{idxSelectedSection === 4 && <div>This is Hotel</div>}
						{idxSelectedSection === 5 && viewSupport}
					</PersistentDrawer>
				</Paper>
			</Loader>
		);
	}
}

export default App;
