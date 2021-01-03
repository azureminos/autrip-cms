const _ = require('lodash');
const axios = require('axios');
const async = require('async');
const keystone = require('keystone');

const tbRefDestination = keystone.list('RefDestination');
const tbRefProduct = keystone.list('RefProduct');

const {
	VIATOR_BASE_URL,
	VIATOR_AUTH_KEY,
	EXPOZ_BASE_URL,
	EXPOZ_AUTH_USR,
	EXPOZ_AUTH_PWD,
} = process.env;

/* ==== Helpers ==== */
const doFilter = function (input) {
	return doFilterByDuration(input);
};
const doFilterByDuration = function (input) {
	return !input.duration || input.duration.indexOf('ays') > -1;
};

// Delete all Viator Ref_Product
exports.delRefProductViator = (req, res, next) => {
	console.log('>>>>Function [delRefProductViator] started');
	tbRefProduct.model.deleteMany({ source: 'VIATOR' }, () => {
		console.log('>>>>Function [delRefProductViator] executed');
		if (res) {
			return res.apiResponse({ result: 200, error: '' });
		} else if (next) {
			next();
		}
	});
};

// Delete all ExpOz Ref_Product
exports.delRefProductExpOz = (req, res, next) => {
	console.log('>>>>Function [delRefProductExpOz] started');
	tbRefProduct.model.deleteMany({ source: 'EXPOZ' }, () => {
		console.log('>>>>Function [delRefProductExpOz] executed');
		if (res) {
			return res.apiResponse({ result: 200, error: '' });
		} else if (next) {
			next();
		}
	});
};

// Load Viator Ref Product
exports.loadRefProductViator = (req, res, next) => {
	console.log('>>>>Function [loadRefProductViator] started');
	tbRefDestination.model.find({ type: 'CITY' }, (err, docs) => {
		if (err) {
			console.log('>>>>Function [loadRefProductViator] error', err);
			next();
		} else {
			console.log(
				`>>>>Function [loadRefProductViator] retrieved [${docs.length}] cities'`
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
								if (
									!_.find(products, { productCode: p.code })
									&& !doFilter(p)
								) {
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
										hotelPickup: false,
										addrCheckIn: '',
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
						console.log('>>>>Function [loadRefProductViator] completed');
						if (res) {
							return res.apiResponse({ result: 200, error: '' });
						} else if (next) {
							next();
						}
					});
				} else {
					console.log('>>>>Function [loadRefProductViator] error', err);
					if (res) {
						return res.apiResponse({ result: 500, error: err });
					} else if (next) {
						next('>>>>Function [loadRefProductViator] unknown error');
					}
				}
			});
		}
	});
};

// Load ExpOz Ref Product
exports.loadRefProductExpOz = (req, res, next) => {
	console.log('>>>>Function [loadRefProductExpOz] started');
	tbRefDestination.model.find({ type: 'CITY' }, (err, docs) => {
		if (err) {
			console.log('>>>>Function [loadRefProductExpOz] error', err);
			next();
		} else {
			console.log(
				`>>>>Function [loadRefProductExpOz] retrieved [${docs.length}] cities'`
			);
			const promises = [];
			const products = [];
			_.forEach(docs, city => {
				promises.push(callback => {
					const urlCity = city.name.toLowerCase().replace(' ', '-');
					console.log(`>>>>Processing Product of City[${urlCity}]`);
					setTimeout(function () {
						axios
							.get(`${EXPOZ_BASE_URL}/${urlCity}`, {
								auth: {
									username: EXPOZ_AUTH_USR,
									password: EXPOZ_AUTH_PWD,
								},
							})
							.then(resp => {
								console.log(`>>>>Retrieved Product of City[${city.name}]`);
								const count
									= resp.data && resp.data.operators && resp.data.operators.length
										? resp.data.operators.length
										: 0;
								console.log(
									`>>>>Retrieved [${count}] Product of City[${city.name}]`
								);
								_.forEach(resp.data.operators, p => {
									if (!_.find(products, { productCode: String(p.id) })) {
										products.push({
											source: 'EXPOZ',
											productCode: String(p.id),
											name: p.publicName,
											shortTitle: p.publicName,
											primaryDestinationName: city.name,
											primaryDestinationId: city.destinationId,
											shortDescription: p.summary,
											thumbnailHiResURL: p.images[0],
											thumbnailURL: p.images[0],
											rating: p.rating,
											photoCount: p.images.length,
											supplierName: p.supplierName,
											supplierCode: p.supplierCode,
											available: true,
											price: p.retailPrice,
											currencyCode: 'AUD',
											onSale: false,
											specialOfferAvailable: false,
											hotelPickup: false,
											addrCheckIn: '',
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
					}, 2000);
				});
			});
			async.series(promises, function (err) {
				if (!err) {
					console.log(`>>>>[${products.length}] items loaded into RefProduct`);
					tbRefProduct.model.insertMany(products, () => {
						console.log('>>>>Function [loadRefProductExpOz] completed');
						if (res) {
							return res.apiResponse({ result: 200, error: '' });
						} else if (next) {
							next();
						}
					});
				} else {
					console.log('>>>>Function [loadRefProductExpOz] error', err);
					if (res) {
						return res.apiResponse({ result: 500, error: err });
					} else if (next) {
						next('>>>>Function [loadRefProductExpOz] unknown error');
					}
				}
			});
		}
	});
};
