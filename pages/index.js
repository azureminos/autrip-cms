import { Component } from 'react';
import axios from 'axios';

class App extends Component {

	static async getInitialProps () {
		const urlGetPackages = `${process.env.API_BASE_URL}/api/travelpackage`;
		let resPackages = await axios.get(urlGetPackages);

		const urlGetMetadata = `${process.env.API_BASE_URL}/api/metadata`;
		let resMetadata = await axios.get(urlGetMetadata);

		return { packages: resPackages.data, filters: resMetadata.data };
	}

	render () {
		return (
			<div>Hello World</div>
		);
	};
}

export default App;
