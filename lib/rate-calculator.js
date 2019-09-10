const _ = require('lodash');
const CONSTANTS = require('./constants');

const { Global } = CONSTANTS.get();

// ====== Helper ======
// Determine car-rate based ob the input
const getCarRate = (params, carRates) => {
	let rate = {};
	const { startDate, carOption, total } = params;
	for (var i = 0; carRates && i < carRates.length; i++) {
		const cr = carRates[i];
		const city = cr.name;
		// Check if match city
		for (var m = 0; cr.carRates && m < cr.carRates.length; m++) {
			const r = cr.carRates[m];
			if (
				total >= r.minParticipant
				&& total <= r.maxParticipant
				&& carOption === r.type
				&& (!startDate
					|| (startDate.getTime() >= new Date(r.rangeFrom).getTime()
						&& startDate.getTime() <= new Date(r.rangeTo).getTime()))
			) {
				rate[city] = {
					rate: r.rate || 999,
					localGuide: r.rateLocalGuide || 0,
					airport: r.rateAirport || 0,
				};
				return rate;
			}
		}
	}
};
// Determine car-rate based ob the input
const getItineraryTime = (items, hotels) => {
	let lastCity = '';
	let itineraryTime = {};
	const dayItems = _.groupBy(items, i => {
		return i.dayNo;
	});
	const dayHotels = _.groupBy(hotels, h => {
		return h.dayNo;
	});
	const days = _.keys(dayItems);
	_.each(days, (day, idx) => {
		const di = dayItems[day];
		const dh = dayHotels[day];
		if (di && di.length > 0 && di[0]) {
			if (!di[0].attraction) {
				if (dh && dh.length > 0 && dh[0]) {
					const totalTraffic = 0;
					const totalVisit = 0;
					const isAirport = idx === 0 || idx === days.length - 1;
					const city = dh[0].hotel ? dh[0].hotel.city : lastCity;
					itineraryTime[day] = { city, totalTraffic, totalVisit, isAirport };
					lastCity = city;
				}
			} else {
				const city = di[0].attraction.city;
				const isAirport = false;
				let lastAttraction = '';
				let totalTraffic = 0;
				let totalVisit = 0;
				_.each(di, d => {
					totalTraffic += d.attraction.timeTraffic || 0;
					totalVisit += d.attraction.timeVisit || 0;
					if (d.daySeq !== 1) {
						// Check if it's nearby of previous attraction
						if (
							_.find(d.attraction.nearByAttractions, a => {
								return a === lastAttraction;
							})
						) {
							totalVisit--;
						}
					}
					lastAttraction = d.attraction.id;
				});
				itineraryTime[day] = { city, totalTraffic, totalVisit, isAirport };
				lastCity = city;
			}
		}
	});
	return itineraryTime;
};

// Rate Calculator
exports.calPackageRate = (params, packageRates) => {
	const { startDate, totalPeople } = params;
	const total = totalPeople || 0;
	if (startDate) {
		for (var i = 0; i < packageRates.length; i++) {
			const {
				minParticipant,
				maxParticipant,
				rate,
				premiumFee,
				rangeFrom,
				rangeTo,
			} = packageRates[i];
			if (
				total >= minParticipant
				&& total <= maxParticipant
				&& startDate.getTime() >= new Date(rangeFrom).getTime()
				&& startDate.getTime() <= new Date(rangeTo).getTime()
			) {
				return {
					price: rate,
					premiumFee: premiumFee,
					maxParticipant: maxParticipant,
				};
			}
		}
	} else {
		const matchedRates = _.filter(packageRates, o => {
			return total >= o.minParticipant && total <= o.maxParticipant;
		});
		if (matchedRates && matchedRates.length > 0) {
			const minRate = _.minBy(matchedRates, r => {
				return r.rate;
			});
			return {
				price: minRate.rate,
				premiumFee: minRate.premiumFee,
				maxParticipant: minRate.maxParticipant,
			};
		}
	}
	return null;
};

exports.calCarRate = (params, carRates) => {
	const { startDate, totalPeople, carOption, items, hotels } = params;
	const total = totalPeople || 0;
	const input = { startDate, carOption, total };
	const itineraryTime = getItineraryTime(items, hotels);
	const matchedRate = getCarRate(input, carRates);
	// Calculating car rates
	let totalCarRate = 0;
	_.each(_.keys(itineraryTime), key => {
		const it = itineraryTime[key];
		const cityRate
			= matchedRate && matchedRate[it.city] ? matchedRate[it.city] : {};
		let total = it.totalTraffic + it.totalVisit;
		if (total > Global.maxCarTime) {
			total = Global.maxCarTime;
		} else if (total < Global.minCarTime) {
			total = Global.minCarTime;
		}
		// Add car rate
		totalCarRate += total * cityRate.rate;
		// Add Airport transfer rate
		totalCarRate += it.isAirport ? cityRate.airport : 0;
		// Add local guide rate
		totalCarRate += cityRate.localGuide;
	});

	return totalCarRate ? Math.ceil(totalCarRate / totalPeople) : null;
};

exports.calFlightRate = (startDate, flightRates) => {
	if (startDate) {
		for (var i = 0; i < flightRates.length; i++) {
			const { rate, rangeFrom, rangeTo } = flightRates[i];
			if (
				startDate.getTime() >= new Date(rangeFrom).getTime()
				&& startDate.getTime() <= new Date(rangeTo).getTime()
			) {
				return rate;
			}
		}
	} else {
		const minRate = _.minBy(flightRates, r => {
			return r.rate;
		});
		return minRate.rate;
	}
	return null;
};

exports.calItemRate = (params, items) => {
	let totalPrice = 0;
	const tmpItems = _.filter(items, it => {
		return it.attraction;
	});
	for (var i = 0; tmpItems && i < tmpItems.length; i++) {
		totalPrice += tmpItems[i].attraction.rate || 0;
	}
	return totalPrice;
};

exports.calHotelRate = (params, hotels) => {
	let totalPrice = 0;
	const tmpHotels = _.filter(hotels, it => {
		return it.hotel || it.isOverNight;
	});
	for (var i = 0; tmpHotels && i < tmpHotels.length; i++) {
		totalPrice += tmpHotels[i].hotel.defaultRate || 0;
	}
	return totalPrice;
};
