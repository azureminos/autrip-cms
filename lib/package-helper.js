const _ = require('lodash');

exports.deleteItinerary = (instPackage, dayNo) => {
	// Reorg items
	const items = [];
	for (var m = 0; m < instPackage.items.length; m++) {
		var item = instPackage.items[m];
		if (item.dayNo < dayNo) {
			items.push(item);
		} else if (item.dayNo > dayNo) {
			item.dayNo--;
			items.push(item);
		}
	}
	// Reorg hotels
	const hotels = [];
	for (var n = 0; n < instPackage.hotels.length; n++) {
		var hotel = instPackage.hotels[n];
		if (hotel.dayNo < dayNo) {
			hotels.push(hotel);
		} else if (hotel.dayNo > dayNo) {
			hotel.dayNo--;
			hotels.push(hotel);
		}
	}
	instPackage.totalDays = hotels.length;
	instPackage.items = items;
	instPackage.hotels = hotels;
	if (instPackage.startDate) {
		instPackage.endDate = new Date(instPackage.startDate);
		instPackage.endDate.setDate(
			instPackage.endDate.getDate() + instPackage.totalDays
		);
	}

	return instPackage;
};
