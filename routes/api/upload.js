const _ = require('lodash');
const keystone = require('keystone');
const readXlsxFile = require('read-excel-file/node');

const FileData = keystone.list('FileUpload');
const tbRefProduct = keystone.list('RefProduct');

const rules = {
	product: {
		key: { col: 3, name: 'productCode', type: 'string' },
		updates: [
			{ col: 8, name: 'addrCheckIn', type: 'string' },
			{ col: 9, name: 'hotelPickup', type: 'boolean' },
			{ col: 10, name: 'tag', type: 'string[]', delimiter: '#' },
			{ col: 11, name: 'rating', type: 'number' },
		],
	},
	attraction: {},
};
/**
 * Upload a New Product File
 */
exports.createProduct = function (req, res) {
	const item = new FileData.model();
	const getValue = (r, d) => {
		if (d.type === 'string') {
			return r[d.col] || '';
		} else if (d.type === 'number') {
			return Number(r[d.col] || 0);
		} else if (d.type === 'boolean') {
			return (String(r[d.col]) || '').toUpperCase() === 'TRUE';
		} else if (d.type === 'string[]') {
			let arr = r[d.col] || '' ? r[d.col].split(d.delimiter) : [];
			return _.filter(arr, a => {
				return !!a;
			});
		}
	};
	item.getUpdateHandler(req).process(req.files, function (err) {
		if (err) return res.apiError('error', err);
		// console.log('>>>>FileUpload.createProduct() begin', item.file);
		let path = `${__dirname}/../../public/uploads/files/${item.file.filename}`;

		readXlsxFile(path).then(rows => {
			// skip header
			rows.shift();
			const products = [];
			console.log('>>>>FileUpload.createProduct() processing', rows.length);
			rows.forEach(row => {
				let product = {};
				product[rules.product.key.name] = getValue(row, rules.product.key);
				rules.product.updates.forEach(item => {
					product[item.name] = getValue(row, item);
				});
				if (product.hotelPickup || (product.tag && product.tag.length > 0)) {
					products.push(product);
				}
			});
			products.forEach(p => {
				if (p.hotelPickup) {
					console.log('>>>>David', p);
					tbRefProduct.model
						.find({ productCode: p.productCode })
						.exec(function (err, docs) {
							if (err || !docs || docs.length === 0) {
								console.log(`>>>>No matching product[${p.productCode}]`);
							}
							docs.forEach(d => {
								console.log(
									`>>>>Update product[${p.productCode}] ID[${d._id}]`
								);
								tbRefProduct.model
									.findByIdAndUpdate(d._id, {
										...p,
										tag: _.union(docs.tag, p.tag),
									})
									.exec(function (err, docs) {
										// Do Nothing
										/* console.log('>>>>Result of findByIdAndUpdate', {
											err,
											docs,
										});*/
									});
							});
						});
				}
			});
			res.status(200).send({
				message: 'File uploaded successfully',
			});
		});
	});
};
/**
 * Upload a New Attraction File
 */
exports.createAttraction = function (req, res) {
	const item = new FileData.model();
	console.log('>>>>FileUpload.createAttraction()', {
		body: req.body,
		files: req.files,
	});
	item.getUpdateHandler(req).process(req.files, function (err) {
		if (err) return res.apiError('error', err);
		console.log('>>>>FileUpload.createAttraction() begin', item.file);
		let path = `${__dirname}/../../public/uploads/files/${item.file.filename}`;

		readXlsxFile(path).then(rows => {
			// skip header
			rows.shift();

			// let tutorials = [];
			console.log('>>>>FileUpload.createAttraction() processing', rows.length);
			/* rows.forEach(row => {
				let tutorial = {
					id: row[0],
					title: row[1],
					description: row[2],
					published: row[3],
				};

				tutorials.push(tutorial);
			});*/

			res.status(200).send({
				message: 'File uploaded successfully',
			});
		});
	});
};
