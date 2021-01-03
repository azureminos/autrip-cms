const _ = require('lodash');
const axios = require('axios');
const async = require('async');
const keystone = require('keystone');

const tbRefDestination = keystone.list('RefDestination');
const tbRefAttraction = keystone.list('RefAttraction');

const {
	VIATOR_BASE_URL,
	VIATOR_AUTH_KEY,
	ATDW_BASE_URL,
	ATDW_DIST_KEY,
} = process.env;
// Delete all Viator Ref_Attraction
exports.delRefAttractionViator = (req, res, next) => {
	console.log('>>>>Function [delRefAttractionViator] started');
	tbRefAttraction.model.deleteMany({ source: 'VIATOR' }, () => {
		console.log('>>>>Function [delRefAttractionViator] executed');
		if (res) {
			return res.apiResponse({ result: 200, error: '' });
		} else if (next) {
			next();
		}
	});
};
// Delete all ATDW Ref_Attraction
exports.delRefAttractionAtdw = (req, res, next) => {
	console.log('>>>>Function [delRefAttractionAtdw] started');
	tbRefAttraction.model.deleteMany({ source: 'ATDW' }, () => {
		console.log('>>>>Function [delRefAttractionAtdw] executed');
		if (res) {
			return res.apiResponse({ result: 200, error: '' });
		} else if (next) {
			next();
		}
	});
};
// Load Viator Ref Attraction
exports.loadRefAttractionViator = (req, res, next) => {
	console.log('>>>>Function [loadRefAttractionViator] started');
	tbRefDestination.model.find({ type: 'CITY' }, (err, docs) => {
		if (err) {
			console.log('>>>>Function [loadRefAttractionViator] error', err);
			next();
		} else {
			console.log(
				`>>>>Function [loadRefAttractionViator] retrieved [${docs.length}] cities'`
			);
			const promises = [];
			const attractions = [];
			_.forEach(docs, city => {
				promises.push(callback => {
					console.log(`>>>>Processing Attraction of City[${city.name}]`);
					axios
						.post(
							`${VIATOR_BASE_URL}/service/search/attractions`,
						{
							destId: city.destinationId,
						},
						{
							headers: {
								'exp-api-key': VIATOR_AUTH_KEY,
							},
						}
						)
						.then(resp => {
							const count
								= resp.data && resp.data.data && resp.data.data.length
									? resp.data.data.length
									: 0;
							console.log(
								`>>>>Retrieved [${count}] Attraction of City[${city.name}]`
							);
							_.forEach(resp.data.data, att => {
								if (!_.find(attractions, { seoId: att.seoId })) {
									console.log(`>>>>Processing Attraction`, att);
									attractions.push({
										source: 'VIATOR',
										name: att.title,
										seoId: att.seoId,
										webURL: att.webURL,
										description: att.descriptionText,
										summary: att.overviewSummary,
										primaryDestinationName: att.primaryDestinationName,
										primaryDestinationId: att.primaryDestinationId,
										primaryGroupId: att.primaryGroupId,
										thumbnailHiResURL: att.thumbnailHiResURL,
										thumbnailURL: att.thumbnailURL,
										rating: att.rating,
										photoCount: att.photoCount,
										latitude: att.latitude,
										longitude: att.longitude,
										attractionStreetAddress: att.attractionStreetAddress,
										attractionCity: att.attractionCity,
										attractionState: att.attractionState,
									});
								}
							});
							callback();
						})
						.catch(error => {
							console.log(
								`>>>>Error when processing Attraction of City[${city.name}]`
							);
							callback();
						});
				});
			});
			async.series(promises, function (err) {
				if (!err) {
					console.log(
						`>>>>[${attractions.length}] items loaded into RefAttraction`
					);
					tbRefAttraction.model.insertMany(attractions, () => {
						console.log('>>>>Function [loadRefAttractionViator] completed');
						if (res) {
							return res.apiResponse({ result: 200, error: '' });
						} else if (next) {
							next();
						}
					});
				} else {
					console.log('>>>>Function [loadRefAttractionViator] error', err);
					if (res) {
						return res.apiResponse({ result: 500, error: err });
					} else if (next) {
						next('>>>>Function [loadRefAttractionViator] unknown error');
					}
				}
			});
		}
	});
};

// Load ATDW Ref Attraction
exports.loadRefAttractionAtdw = (req, res, next) => {
	console.log('>>>>Function [loadRefAttractionAtdw] started');
	axios
		.get(`${ATDW_BASE_URL}/products?key=${ATDW_DIST_KEY}&out=json&size=5000`, {
			responseType: 'arraybuffer',
		})
		.then(respBuffer => {
			// console.log(respBuffer.headers['content-type']);
			const resp = JSON.parse(respBuffer.data.toString('utf16le'));
			const count
				= resp && resp.products && resp.products.length
					? resp.products.length
					: 0;
			console.log(`>>>>Retrieved ${count} Attractions from ATDW`);
			const attractions = [];
			_.forEach(resp.products, att => {
				const geos = att.boundary ? att.boundary.split(',') : ['', ''];
				const addr
					= att.addresses && att.addresses.length > 0 ? att.addresses[0] : null;
				attractions.push({
					source: 'ATDW',
					name: att.productName,
					seoId: 0,
					webURL: '',
					description: att.productDescription,
					summary: '',
					primaryDestinationName: addr ? addr.city : '',
					primaryDestinationId: '',
					primaryGroupId: '',
					thumbnailHiResURL: att.productImage,
					thumbnailURL: att.productImage,
					rating: att.score,
					photoCount: att.productImage ? 1 : 0,
					latitude: geos[0],
					longitude: geos[1],
					attractionStreetAddress: addr
						? `${addr.address_line} ${addr.address_line2}`
						: '',
					attractionCity: addr ? addr.city : '',
					attractionState: addr ? addr.state : '',
				});
			});
			console.log(
				`>>>>[${attractions.length}] items loaded into RefAttraction`
			);
			tbRefAttraction.model.insertMany(attractions, (error, docs) => {
				if (error) {
					console.log('>>>>Function [loadRefAttractionAtdw] error', error);
					if (res) {
						return res.apiResponse({ result: 400, error: error });
					} else if (next) {
						next();
					}
				} else {
					console.log('>>>>Function [loadRefAttractionAtdw] completed');
					if (res) {
						return res.apiResponse({ result: 200, error: '' });
					} else if (next) {
						next();
					}
				}
			});
		})
		.catch(error => {
			console.log(`>>>>Error when processing Attraction from ATDW`);
			next();
		});
};
