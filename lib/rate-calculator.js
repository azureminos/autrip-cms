exports.calPackageRate = (params, packageRates) => {
	const { startDate, adults, kids } = params;
	const total = (adults || 0) + (kids || 0);
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
	const { startDate, adults, kids, totalDays, carOption } = params;
	const total = (adults || 0) + (kids || 0);
	if (startDate && carOption) {
		for (var i = 0; i < carRates.length; i++) {
			const {
				minParticipant,
				maxParticipant,
				rate,
				rangeFrom,
				rangeTo,
				type,
			} = carRates[i];
			if (
				total >= minParticipant
				&& total <= maxParticipant
				&& carOption === type
				&& startDate.getTime() >= new Date(rangeFrom).getTime()
				&& startDate.getTime() <= new Date(rangeTo).getTime()
			) {
				return rate * totalDays;
			}
		}
	} else {
		const matchedRates = _.filter(carRates, o => {
			return (
				total >= o.minParticipant
				&& total <= o.maxParticipant
				&& (!carOption || carOption === o.type)
				&& (!startDate
					|| (startDate.getTime() >= new Date(o.rangeFrom).getTime()
						&& startDate.getTime() <= new Date(o.rangeTo).getTime()))
			);
		});
		if (matchedRates && matchedRates.length > 0) {
			const minRate = _.minBy(matchedRates, r => {
				return r.rate;
			});
			return minRate.rate * totalDays;
		}
	}
	return 9999;
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

	return 9999;
};

exports.calItemRate = (items, cities) => {
	let totalPrice = 0;
	const tmpItems = _.filter(items, it => {
		return it.attraction;
	});
	for (var i = 0; tmpItems && i < tmpItems.length; i++) {
		var item = null;
		_.each(cities, c => {
			const matcher = _.find(c.attractions, function (a) {
				return a.id === tmpItems[i].attraction.id;
			});
			if (matcher) item = matcher;
		});
		totalPrice = totalPrice + (item ? item.rate : 0);
	}
	return totalPrice;
};

exports.calHotelRate = (params, hotels, cities) => {
	return 0;
};
