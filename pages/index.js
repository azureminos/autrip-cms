import { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import io from 'socket.io-client';
import { Paper, Typography } from '@material-ui/core';
import FullWidthTabs from '../components/fixed-tab';
import SearchAppBar from '../components/app-bar';
import PackageCardList from '../components/package-card-list';
import PersistentDrawer from '../components/persistent-drawer';
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig();
const { SOCKET_BASE_URL } = publicRuntimeConfig;

let socket;

class App extends Component {

	static async getInitialProps() {
		const urlGetPackages = `${process.env.API_BASE_URL}/api/travelpackage`;
		let resPackages = await axios.get(urlGetPackages);

		const urlGetMetadata = `${process.env.API_BASE_URL}/api/metadata`;
		let resMetadata = await axios.get(urlGetMetadata);

		return { messages: [], packages: resPackages.data, filters: resMetadata.data };
	}

	state = {
		isUpdating: false,
		idxSelected: 0,
		messages: [{id:1, value:'AA'}, {id:2, value:'AB'}],
	};

	/* ==============================
     = React Lifecycle            =
     ============================== */

	// connect to WS server and listen event
	componentDidMount() {
		console.log('>>>>Print system env', SOCKET_BASE_URL);
		socket = io('http://localhost:4000')
		socket.on('message', this.handleMessage)
	}

	// close socket connection
	componentWillUnmount() {
		socket.off('message', this.handleMessage)
		socket.close()
	}

	  // add messages from server to the state
	  handleMessage = (message) => {
		console.log('>>>>App.handleMessage', message);
		//this.setState(state => ({ messages: state.messages.concat(message) }))
	  }

	handleSocketMessage = (msg) => {
		console.log('>>>>App.handleSocketMessage', msg);
	};

	handleDrawerItemClick = (idx) => {
		//Add here for logics to update state
		this.setState({ idxSelected: idx });
		console.log("socket.emit('push:message', 'Hello')");
		socket.emit('push:message', {
			id: (new Date()).getTime(),
			value: String(new Date().getTime()),
		});
	};

	render() {
		const { packages, filters } = this.props;
		const { isUpdating, idxSelected } = this.state;
		let tabs, page;
		//Init tab content to display all packages
		const tabPackages = (
			<div>
				<SearchAppBar />
				<PackageCardList
					packages={packages}
					filters={filters}
				/>
			</div>

		);
		//Init tab content to display all attractions
		const tabAttractions = (
			<Typography>
				Show all attractions
			</Typography>
		);
		tabs = {
			Packages: tabPackages,
			Attractions: tabAttractions,
		};

		const drawerItems = ['AA', 'BB'];

		//Init page
		page = (
			<Paper>
				<PersistentDrawer
					drawerItems={drawerItems}
					selectedDrawerItem={idxSelected}
					handleDrawerItemClick={this.handleDrawerItemClick}
				>
					<div>Hello Everyone</div>
				</PersistentDrawer>
			</Paper >
		);

		return (page);
	};
}

export default App;
