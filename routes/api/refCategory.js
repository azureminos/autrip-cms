const _ = require('lodash');
const axios = require('axios');
const async = require('async');
const keystone = require('keystone');

const tbRefCategory = keystone.list('RefCategory');
const tbRefSubCategory = keystone.list('RefSubCategory');
const tbRefTagGroup = keystone.list('RefTagGroup');

const { VIATOR_BASE_URL, VIATOR_AUTH_KEY } = process.env;
// Delete all TagGroup
exports.delRefTagGroup = (req, res, next) => {
	console.log('>>>>Function [delRefTagGroup] started');
	tbRefTagGroup.model.deleteMany({}, () => {
		console.log('>>>>Function [delRefTagGroup] executed');
		if (res) {
			return res.apiResponse({ result: 200, error: '' });
		} else if (next) {
			next();
		}
	});
};
// Delete all RefCategory
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
// Delete all RefSubCategory
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
	const promises = [];
	const cats = [];
	const subcats = [];
	const tagGroups = [];

	axios
		.get(`${VIATOR_BASE_URL}/service/taxonomy/categories`, {
			headers: {
				'exp-api-key': VIATOR_AUTH_KEY,
			},
		})
		.then(resp => {
			_.forEach(resp.data.data, it => {
				if (!_.find(cats, { itemId: it.id })) {
					let tagGroup = { name: it.groupName, tags: [] };
					cats.push({
						itemId: it.id,
						name: it.groupName,
						thumbnailURL: it.thumbnailURL,
						thumbnailHiResURL: it.thumbnailHiResURL,
					});
					_.forEach(it.subcategories, subit => {
						tagGroup.tags.push(subit.subcategoryName);
						if (!_.find(subcats, { itemId: subit.subcategoryId })) {
							subcats.push({
								itemId: subit.subcategoryId,
								parentId: it.id,
								name: subit.subcategoryName,
							});
						}
					});
					tagGroups.push(tagGroup);
				}
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
							callback1 => {
								console.log(
									`>>>>[${tagGroups.length}] item loaded into RefTagGroup`
								);
								tbRefTagGroup.model.insertMany(tagGroups, callback1);
							},
						],
						function (err) {
							console.log('>>>>Function [loadRefCategory] completed');
							if (res) {
								return res.apiResponse({ result: 200, error: '' });
							} else if (next) {
								next({
									categories: cats,
									subCategories: subcats,
								});
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
		});
};
