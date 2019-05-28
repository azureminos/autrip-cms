const _ = require('lodash');

exports.findCityById = (id, cities) => {
	var name = '';
	_.each(cities, (c) => { if (c.id === id) name = c.name; });
	return name;
};
