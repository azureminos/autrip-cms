const rate = {
	CNY: 4.76,
	JPY: 71.81,
	USD: 0.68,
};

const financial = x => {
	return Number.parseFloat(x).toFixed(2);
};

exports.convertRate = params => {
	console.log('>>>>Currency.convertRate', params);
	const { currency, amount } = params;

	if (!currency) {
		if (typeof amount === 'number') {
			return financial(amount / rate.CNY);
		} else {
			return financial((Number(amount) || 0) / rate.CNY);
		}
	} else {
		if (typeof amount === 'number') {
			return financial(amount / rate[currency]);
		} else {
			return financial((Number(amount) || 0) / rate[currency]);
		}
	}
};
