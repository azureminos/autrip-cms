const _ = require('lodash');
const axios = require('axios');
const async = require('async');
const keystone = require('keystone');

const tbRefDestination = keystone.list('RefDestination');
const tbRefCategory = keystone.list('RefCategory');
const tbRefSubCategory = keystone.list('RefSubCategory');

const { VIATOR_BASE_URL, VIATOR_AUTH_KEY } = process.env;
// Delete all Ref_Category
exports.delRefCategory = (req, res, next) => {
	console.log('>>>>Function [delRefCategory] started');
	tbRefCategory.model.deleteMany({}, () => {
		console.log('>>>>Function [delRefCategory] executed');
		if (res) {
			return res.apiResponse({ result: 200, error: '' });
		} else if (next) {
			next();
		}
	});
};
// Delete all Ref_SubCategory
exports.delRefSubCategory = (req, res, next) => {
	console.log('>>>>Function [delRefSubCategory] started');
	tbRefSubCategory.model.deleteMany({}, () => {
		console.log('>>>>Function [delRefSubCategory] executed');
		if (res) {
			return res.apiResponse({ result: 200, error: '' });
		} else if (next) {
			next();
		}
	});
};

// Load Ref Category
exports.loadRefCategory = (req, res, next) => {
	console.log('>>>>Function [loadRefCategory] started');
	tbRefDestination.model.find({ type: 'COUNTRY' }, (err, docs) => {
		if (err) {
			console.log('>>>>Function [loadRefCategory] error', err);
			next();
		} else {
			console.log(
				`>>>>Function [loadRefCategory] retrieved [${docs.length}] countries'`
			);
			const promises = [];
			const cats = [];
			const subcats = [];
			_.forEach(docs, item => {
				promises.push(callback => {
					console.log(`>>>>Processing Category of Country[${item.name}]`);
					axios
						.get(
							`${VIATOR_BASE_URL}/service/taxonomy/categories?destId=${item.destinationId}`,
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
							console.log('>>>>Function [loadRefCategory] completed');
							if (res) {
								return res.apiResponse({ result: 200, error: '' });
							} else if (next) {
								next();
							}
						}
					);
				} else {
					console.log('>>>>Function [loadRefCategory] error', err);
					if (res) {
						return res.apiResponse({ result: 500, error: err });
					} else if (next) {
						next('>>>>Function [loadRefCategory] unknown error');
					}
				}
			});
		}
	});
};
