const async = require('async');
const keystone = require('keystone');
const helper = require('../lib/object-parser');

exports.getPackageDetails = ({request: {id}, sendStatus, socket}) => {
  console.log('>>>>server socket received event[push:package:get]', id);
  // async calls
  async.parallel({
    package: (callback) => {
      const TravelPackage = keystone.list('TravelPackage');
      TravelPackage.model
        .findById(id)
        .exec(function (err, item) {
          console.log('>>>>server async calls for event[push:package:get]', item);
          return callback(null, helper.parseTravelPackage(item));
        });
    },
  }, function (err, results) {
    console.log('>>>>server final callback for event[push:package:get]', results);
    socket.emit('package:get', results);
  });

  channel('disconnect', () => {
    console.log('>>>>User disconnected');
  });
};
