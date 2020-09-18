const _ = require('lodash');
const axios = require('axios');
const async = require('async');
const keystone = require('keystone');

const tbRefDestination = keystone.list('RefDestination');
const tbRefProduct = keystone.list('RefProduct');

const { VIATOR_BASE_URL, VIATOR_AUTH_KEY } = process.env;
// Delete all Ref_Product
exports.delRefProduct = (req, res, next) => {
	console.log('>>>>Function [delRefProduct] started');
	tbRefProduct.model.deleteMany({}, () => {
		console.log('>>>>Function [delRefProduct] executed');
		if (res) {
			return res.apiResponse({ result: 200, error: '' });
		} else if (next) {
			next();
		}
	});
};
// Load Ref Product
exports.loadRefProduct = (req, res, next) => {
	console.log('>>>>Function [loadRefProduct] started');
	tbRefDestination.model.find({ type: 'CITY' }, (err, docs) => {
		if (err) {
			console.log('>>>>Function [loadRefProduct] error', err);
			next();
		} else {
			console.log(
				`>>>>Function [loadRefProduct] retrieved [${docs.length}] cities'`
			);
			const promises = [];
			const products = [];
			_.forEach(docs, city => {
				promises.push(callback => {
					console.log(`>>>>Processing Product of City[${city.name}]`);
					axios
						.post(
							`${VIATOR_BASE_URL}/service/search/products`,
						{
							destId: city.destinationId,
							currencyCode: 'AUD',
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
								`>>>>Retrieved [${count}] Product of City[${city.name}]`
							);
							_.forEach(resp.data.data, p => {
								if (!_.find(products, { productCode: p.code })) {
									products.push({
										source: 'VIATOR',
										productCode: p.code,
										name: p.title,
										shortTitle: p.shortTitle,
										primaryDestinationName: p.primaryDestinationName,
										primaryDestinationId: p.primaryDestinationId,
										primaryGroupId: p.primaryGroupId,
										shortDescription: p.shortDescription,
										duration: p.duration,
										webURL: p.webURL,
										thumbnailHiResURL: p.thumbnailHiResURL,
										thumbnailURL: p.thumbnailURL,
										rating: p.rating,
										reviewCount: p.reviewCount,
										photoCount: p.photoCount,
										supplierName: p.supplierName,
										supplierCode: p.supplierCode,
										available: p.available,
										price: p.price,
										currencyCode: p.currencyCode,
										onSale: p.onSale,
										specialOfferAvailable: p.specialOfferAvailable,
										bookingEngineId: p.bookingEngineId,
										specialReservationDetails: p.specialReservationDetails,
										merchantCancellable: p.merchantCancellable,
									});
								}
							});
							callback();
						})
						.catch(error => {
							console.log(
								`>>>>Error when processing Product of City[${city.name}]`
							);
							callback();
						});
				});
			});
			async.series(promises, function (err) {
				if (!err) {
					console.log(`>>>>[${products.length}] items loaded into RefProduct`);
					tbRefProduct.model.insertMany(products, () => {
						console.log('>>>>Function [loadRefProduct] completed');
						if (res) {
							return res.apiResponse({ result: 200, error: '' });
						} else if (next) {
							next();
						}
					});
				} else {
					console.log('>>>>Function [loadRefProduct] error', err);
					if (res) {
						return res.apiResponse({ result: 500, error: err });
					} else if (next) {
						next('>>>>Function [loadRefProduct] unknown error');
					}
				}
			});
		}
	});
};
