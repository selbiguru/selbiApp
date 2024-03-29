/**
 * @method getCurrentPosition
 * Get device's current location
 */
exports.getCurrentPosition = function(callback) {
	if (Titanium.Geolocation.locationServicesEnabled == false) {
		Titanium.UI.createAlertDialog({
			message : 'Please enable location services.'
		}).show();
	} else {

		Ti.Geolocation.headingFilter = 1;
		Ti.Geolocation.showCalibration = false;
		Ti.Geolocation.distanceFilter = 10;
		Ti.Geolocation.preferredProvider = 'gps';
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				callback({
					lng : '-73.999014',
					lat : '40.724458'
				});
			}
			if (e.success) {
				callback({
					lng : e.coords.longitude,
					lat : e.coords.latitude
				});
			}
		});
	}
};
