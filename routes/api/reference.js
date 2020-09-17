const _ = require('lodash');
const axios = require('axios');
const async = require('async');
const keystone = require('keystone');

const tbRefCountry = keystone.list('RefCountry');
const tbRefDestination = keystone.list('RefDestination');
const tbRefCategory = keystone.list('RefCategory');
const tbRefSubCategory = keystone.list('RefSubCategory');
const tbRefProduct = keystone.list('RefProduct');

/* ==== Local functions ==== */
// Delete all Ref_Country
const doDelRefCountry = next => {
	console.log('>>>>Function [doDelRefCountry] started');
	tbRefCountry.model.deleteMany({}, () => {
		console.log('>>>>Function [doDelRefCountry] executed');
		next();
	});
};
// Delete all Ref_Destination
const doDelRefDestination = next => {
	console.log('>>>>Function [doDelRefDestination] started');
	tbRefDestination.model.deleteMany({}, () => {
		console.log('>>>>Function [doDelRefDestination] executed');
		next();
	});
};
// Delete all Ref_Category
const doDelRefCategory = next => {
	console.log('>>>>Function [doDelRefCategory] started');
	tbRefCategory.model.deleteMany({}, () => {
		console.log('>>>>Function [doDelRefCategory] executed');
		next();
	});
};
// Delete all Ref_SubCategory
const doDelRefSubCategory = next => {
	console.log('>>>>Function [doDelRefSubCategory] started');
	tbRefSubCategory.model.deleteMany({}, () => {
		console.log('>>>>Function [doDelRefSubCategory] executed');
		next();
	});
};
// Delete all Ref_Product
const doDelRefProduct = next => {
	console.log('>>>>Function [doDelRefProduct] started');
	tbRefProduct.model.deleteMany({}, () => {
		console.log('>>>>Function [doDelRefProduct] executed');
		next();
	});
};
// Load Ref Country and Destinations
const doLoadRefDestination = (req, res, next) => {
	console.log('>>>>Function [doLoadRefDestination] started');
	axios
		.get('https://viatorapi.viator.com/service/taxonomy/destinations', {
			headers: {
				'exp-api-key': '1ed594e8-944b-404f-bd21-92d9090c64d4',
			},
		})
		.then(resp => {
			const count
				= resp.data && resp.data.data && resp.data.data.length
					? resp.data.data.length
					: 0;
			console.log(
				`>>>>Function [doLoadRefDestination] received data [${count}]`
			);
			if (count > 0) {
				const ds = [];
				const ct = [];
				_.forEach(resp.data.data, item => {
					// Load all countries
					if (item.destinationType === 'COUNTRY') {
						ct.push({ name: item.destinationName });
					}
					// Only load destination with currency code as AUD
					if (item.defaultCurrencyCode === 'AUD') {
						ds.push({
							name: item.destinationName,
							selectable: item.selectable,
							defaultCurrencyCode: item.defaultCurrencyCode,
							parentId: item.parentId,
							timeZone: item.timeZone,
							type: item.destinationType,
							destinationId: item.destinationId,
							latitude: String(item.latitude),
							longitude: String(item.longitude),
						});
					}
				});

				async.series(
					[
						function (callback) {
							console.log(`>>>>[${ct.length}] item loaded into RefCountry`);
							tbRefCountry.model.insertMany(ct, callback);
						},
						function (callback) {
							console.log(`>>>>[${ds.length}] item loaded into RefDestination`);
							tbRefDestination.model.insertMany(ds, callback);
						},
					],
					function (err) {
						console.log('>>>>Function [doLoadRefDestination] items loaded');
						next();
					}
				);
			}
		})
		.catch(error => {
			console.error({ result: 500, error: error });
			next('>>>>Function [doLoadRefDestination] unknown error');
		});
};
// Load Ref Product
const doLoadRefProduct = (req, res, next) => {
	console.log('>>>>Function [doLoadRefProduct] started');
	tbRefDestination.model.find({ type: 'CITY' }, (err, docs) => {
		if (err) {
			console.log('>>>>Function [doLoadRefProduct] error', err);
			next();
		} else {
			console.log(
				`>>>>Function [doLoadRefProduct] retrieved [${docs.length}] cities'`
			);
			const promises = [];
			const products = [];
			_.forEach(docs, city => {
				promises.push(callback => {
					console.log(`>>>>Processing Product of City[${city.name}]`);
					axios
						.post(
							'https://viatorapi.viator.com/service/search/products',
						{
							destId: city.destinationId,
							currencyCode: 'AUD',
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
						console.log('>>>>Function [doLoadRefProduct] completed');
						next();
					});
				} else {
					console.log('>>>>Function [doLoadRefProduct] error', err);
					next();
				}
			});
		}
	});
};
// Load Ref Category
const doLoadRefCategory = (req, res, next) => {
	console.log('>>>>Function [doLoadRefCategory] started');
	tbRefDestination.model.find({ type: 'COUNTRY' }, (err, docs) => {
		if (err) {
			console.log('>>>>Function [doLoadRefCategory] error', err);
			next();
		} else {
			console.log(
				`>>>>Function [doLoadRefCategory] retrieved [${docs.length}] countries'`
			);
			const promises = [];
			const cats = [];
			const subcats = [];
			_.forEach(docs, item => {
				promises.push(callback => {
					console.log(`>>>>Processing Category of Country[${item.name}]`);
					axios
						.get(
							`https://viatorapi.viator.com/service/taxonomy/categories?destId=${item.destinationId}`,
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
								`>>>>Retrieved [${count}] Category of Country[${item.name}]`
							);
							_.forEach(resp.data.data, it => {
								if (!_.find(cats, { itemId: it.id })) {
									cats.push({
										itemId: it.id,
										name: it.groupName,
										thumbnailURL: it.thumbnailURL,
										thumbnailHiResURL: it.thumbnailHiResURL,
									});
									_.forEach(it.subcategories, subit => {
										if (!_.find(subcats, { itemId: subit.subcategoryId })) {
											subcats.push({
												itemId: subit.subcategoryId,
												parentId: it.id,
												name: subit.subcategoryName,
											});
										}
									});
								}
							});
							callback();
						})
						.catch(error => {
							console.log(
								`>>>>Error when processing Category of Country[${item.name}]`
							);
							callback();
						});
				});
			});
			async.series(promises, function (err) {
				if (!err) {
					async.series(
						[
							callback1 => {
								console.log(
									`>>>>[${cats.length}] item loaded into RefCategory`
								);
								tbRefCategory.model.insertMany(cats, callback1);
							},
							callback1 => {
								console.log(
									`>>>>[${subcats.length}] item loaded into RefSubCategory`
								);
								tbRefSubCategory.model.insertMany(subcats, callback1);
							},
						],
						function (err) {
							console.log('>>>>Function [doLoadRefCategory] completed');
							next();
						}
					);
				} else {
					console.log('>>>>Function [doLoadRefCategory] error', err);
					next();
				}
			});
		}
	});
};

/* ==== API to load reference data ==== */
exports.loadReference = function (req, res) {
	res.apiResponse({ result: 200, error: '' });
	async.series(
		[
			function (callback) {
				doDelRefProduct(callback);
			},
			function (callback) {
				doDelRefSubCategory(callback);
			},
			function (callback) {
				doDelRefCategory(callback);
			},
			function (callback) {
				doDelRefDestination(callback);
			},
			function (callback) {
				doDelRefCountry(callback);
			},
			function (callback) {
				doLoadRefDestination(req, res, callback);
			},
			function (callback) {
				doLoadRefCategory(req, res, callback);
			},
			function (callback) {
				doLoadRefProduct(req, res, callback);
			},
		],
		function (err) {
			console.log('All Steps Completed');
		}
	);
};
