import { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import { Paper, Typography } from '@material-ui/core';
import FullWidthTabs from '../components/fixed-tab';

class App extends Component {

	static async getInitialProps () {
		const urlGetPackages = `${process.env.API_BASE_URL}/api/travelpackage`;
		let resPackages = await axios.get(urlGetPackages);

		const urlGetMetadata = `${process.env.API_BASE_URL}/api/metadata`;
		let resMetadata = await axios.get(urlGetMetadata);

		return { packages: resPackages.data, filters: resMetadata.data };
	}

	render () {
		const { packages, filters } = this.props;
		let tabs, page;
		//Init tab content to display all packages
		const tabPackages = (
			<Typography>
				Show all packages
			</Typography>
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
		//Init page
		page = (
			<Paper>
				<FullWidthTabs
					tabs={tabs}
				/>
			</Paper>
		);

		return (page);
	};
}

export default App;
