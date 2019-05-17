const async = require('async');
const keystone = require('keystone');
const helper = require('../lib/object-parser');

exports.getPackageDetails = ({request: {id}, sendStatus, socket}) => {
  console.log('>>>>server socket received event[push:package:get]', id);
  const TravelPackage = keystone.list('TravelPackage');
  // async calls
  async.parallel({
    package: (callback) => {
      TravelPackage.model
        .findById(id)
        .exec(function (err, item) {
          //console.log('>>>>server async calls for event[push:package:get]', item);
          return callback(null, helper.parseTravelPackage(item));
        });
    },
    packageItems: (callback) => {
      TravelPackage.model
      .findById(id).populate('packageItems')
      .exec(function (err, item) {
        return callback(null, item.packageItems);
      });
    },
    packageHotels: (callback) => {
      TravelPackage.model
      .findById(id).populate('packageHotels')
      .exec(function (err, item) {
        return callback(null, item.packageHotels);
      });
    },
    packageRates: (callback) => {
      TravelPackage.model
      .findById(id).populate('packageRates')
      .exec(function (err, item) {
        return callback(null, item.packageRates);
      });
    },
    carRates: (callback) => {
      TravelPackage.model
      .findById(id).populate('carRates')
      .exec(function (err, item) {
        return callback(null, item.carRates);
      });
    },
    flightRates: (callback) => {
      TravelPackage.model
      .findById(id).populate('flightRates')
      .exec(function (err, item) {
        return callback(null, item.flightRates);
      });
    },
  }, function (err, results) {
    console.log('>>>>server final callback for event[push:package:get]', results);
    socket.emit('package:get', results);
  });
};
