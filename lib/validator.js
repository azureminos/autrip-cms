const _ = require('lodash');

exports.validate = product => {
	console.log('>>>>Validate product definition', product);
	let messages = [];
	// messages = messages.concat(checkPackage(product));
	// messages = messages.concat(checkPackageItem(product));
	// messages = messages.concat(checkPackageHotel(product));
	// messages = messages.concat(checkPackageRate(product));
	// messages = messages.concat(checkFlightRate(product));
	// messages = messages.concat(checkCarRate(product));
	console.log('>>>>Validation result', messages);
	if (messages.length > 0) {
		return {
			isValid: false,
			messages: messages,
		};
	}
	return {
		isValid: true,
		messages: [success()],
	};
};
/**
 * Check definition of travel package
 * 1) Departure Date is not empty
 * 2) Total Days is not empty
 * 3) Max Participant is not empty
 * 4) Retail Price is not empty
 * 5) Image is not empty
 * 6) Carousel Images is not empty
 * 7) Title Image is not empty
 */
const checkPackage = product => {
	let rs = ['hello package'];
	return rs;
};
/**
 * Check definition of travel package item
 * 1) [Time Plannable] > 0 must have an attraction
 * 2) No missing or duplicated dayNo
 * 3) No missing or duplicated daySeq
 */
const checkPackageItem = product => {
	let rs = ['hello package item'];
	return rs;
};
/**
 * Check definition of travel package hotel if it's a custmisable package
 * 1) [Stay Overnight] must have an hotel
 * 2) No missing or duplicated dayNo
 */
const checkPackageHotel = product => {
	let rs = ['hello package hotel'];
	return rs;
};
//
const checkPackageRate = product => {
	let rs = [];
	return rs;
};
//
const checkFlightRate = product => {
	let rs = [];
	return rs;
};
//
const checkCarRate = product => {
	let rs = [];
	return rs;
};
// Return success message
const success = () => {
	const rs
		= 'Basic validation passed. Please check the product in desktop view and mobile view';
	return rs;
};
