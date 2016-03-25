/**
 * @method getCurrentPosition
 * Get device's current location
 */
exports.getCurrentPosition = function(callback) {
	if (Titanium.Geolocation.locationServicesEnabled == false) {
		Ti.API.info("ENABLE LOCATION SERVICES");
		Titanium.UI.createAlertDialog({
			message : 'Please enable location serives.'
		}).show();
	} else {

		Ti.Geolocation.headingFilter = 1;
		Ti.Geolocation.showCalibration = false;
		Ti.Geolocation.distanceFilter = 10;
		Ti.Geolocation.preferredProvider = 'gps';
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				callback(e.error);
			}
			if (e.success) {
				Ti.API.info(JSON.stringify(e));
				callback({
					lng : e.coords.longitude,
					lat : e.coords.latitude
				});
			}
		});
	}
};
