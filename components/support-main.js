import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import { Paper, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	cell: {
		padding: '4px',
	},
	button: {
		margin: '4px',
	},
	input: {
		display: 'none',
	},
});

class SupportMain extends React.Component {
	constructor (props) {
		super(props);

		this.doRefreshReference = this.doRefreshReference.bind(this);
		this.doHandleProductUpload = this.doHandleProductUpload.bind(this);
		this.doSubmitProductUpload = this.doSubmitProductUpload.bind(this);
		this.doHandleAttractionUpload = this.doHandleAttractionUpload.bind(this);
		this.doSubmitAttractionUpload = this.doSubmitAttractionUpload.bind(this);
		this.state = {
			fileAttraction: null,
			fileProduct: null,
		};
	}

	/* ----------  Helpers  ------- */
	/* ----------  Event Handlers  ------- */
	doRefreshReference () {
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
	}
	doHandleProductUpload (event) {
		event.preventDefault();
		console.log('>>>>Support.handleProductUpload()', event.target.files);
		this.setState({
			fileProduct: event.target.files[0],
		});
	}
	doSubmitProductUpload (event) {
		event.preventDefault();
		console.log('>>>>Support.doSubmitProductUpload()', this.state.fileProduct);
		var bodyFormData = new FormData();
		bodyFormData.append('file', this.state.fileProduct);
		axios({
			method: 'post',
			url: '/api/uploadProduct',
			data: bodyFormData,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
			.then(function (res) {
				// handle success
				console.log('>>>>Support.doSubmitProductUpload() Finished', res.data);
				alert('Product file has been loaded successfully.');
			})
			.catch(function (error) {
				// handle error
				console.log('>>>>Support.doSubmitProductUpload() Error', error);
				alert('Product file has failed to be loaded.');
			});
	}
	doHandleAttractionUpload (event) {
		event.preventDefault();
		console.log('>>>>Support.handleAttractionUpload()', event.target.files);
		this.setState({
			fileAttraction: event.target.files[0],
		});
	}
	doSubmitAttractionUpload (event) {
		event.preventDefault();
		console.log(
			'>>>>Support.doSubmitAttractionUpload()',
			this.state.fileProduct
		);
		var bodyFormData = new FormData();
		bodyFormData.append('file', this.state.fileAttraction);
		axios({
			method: 'post',
			url: '/api/uploadAttraction',
			data: bodyFormData,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
			.then(function (res) {
				// handle success
				console.log(
					'>>>>Support.doSubmitAttractionUpload() Finished',
					res.data
				);
				alert('Attraction file has been loaded successfully.');
			})
			.catch(function (error) {
				// handle error
				console.log('>>>>Support.doSubmitAttractionUpload() Error', error);
				alert('Attraction file has failed to be loaded.');
			});
	}
	// Display
	render () {
		const { classes } = this.props;

		/* function FormRow () {
			return <React.Fragment></React.Fragment>;
		} */

		return (
			<div className={classes.root}>
				<table>
					<tbody>
						<tr>
							<td className={classes.cell}>Refresh Reference Data</td>
							<td className={classes.cell}></td>
							<td className={classes.cell}>
								<Button
									variant="contained"
									color="default"
									onClick={() => this.doRefreshReference()}
								>
									Refresh
								</Button>
							</td>
						</tr>
						<tr>
							<td className={classes.cell}>Load Product</td>
							<td className={classes.cell}>
								<Button variant="contained" component="label">
									Upload File
									<input
										type="file"
										id="fileProduct"
										onChange={this.doHandleProductUpload}
										style={{ display: 'none' }}
									/>
								</Button>
							</td>
							<td className={classes.cell}>
								<Button
									variant="contained"
									color="default"
									onClick={this.doSubmitProductUpload}
								>
									Load Product
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(SupportMain);
