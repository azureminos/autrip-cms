const _ = require('lodash');
const axios = require('axios');
const async = require('async');
const keystone = require('keystone');

const tbRefDestination = keystone.list('RefDestination');
const tbRefAttraction = keystone.list('RefAttraction');

// Delete all Ref_Attraction
exports.delRefAttraction = next => {
	console.log('>>>>Function [delRefAttraction] started');
	tbRefAttraction.model.deleteMany({}, () => {
		console.log('>>>>Function [delRefAttraction] executed');
		next();
	});
};

// Load Ref Attraction
exports.loadRefAttraction = (req, res, next) => {
	console.log('>>>>Function [loadRefAttraction] started');
	tbRefDestination.model.find({ type: 'CITY' }, (err, docs) => {
		if (err) {
			console.log('>>>>Function [loadRefAttraction] error', err);
			next();
		} else {
			console.log(
				`>>>>Function [loadRefAttraction] retrieved [${docs.length}] cities'`
			);
			const promises = [];
			const attractions = [];
			_.forEach(docs, city => {
				promises.push(callback => {
					console.log(`>>>>Processing Attraction of City[${city.name}]`);
					axios
						.post(
							'https://viatorapi.viator.com/service/taxonomy/attractions',
						{
							destId: city.destinationId,
						},
						{
							headers: {
								'exp-api-key': '1ed594e8-944b-404f-bd21-92d9090c64d4',
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
									attractions.push({
										source: 'VIATOR',
										name: att.title,
										seoId: att.seoId,
										webURL: att.webURL,
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
						console.log('>>>>Function [loadRefAttraction] completed');
						next();
					});
				} else {
					console.log('>>>>Function [loadRefAttraction] error', err);
					next();
				}
			});
		}
	});
};
