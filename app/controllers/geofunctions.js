//GEO STUFF
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
function getGPSpos() {
	try {
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
				Ti.API.info('Get current position' + e.error);
				getGPSpos();
			}
		});

		if (Ti.Geolocation.locationServicesEnabled) {
			Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
			Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS;
			Titanium.Geolocation.pauseLocationUpdateAutomatically = true;
			Titanium.Geolocation.distanceFilter = 3;

			Ti.Geolocation.addEventListener('location', function(e) {
				if (e.error) {
					Ti.API.info('Kan inte sätta eventListener ' + e.error);
				} else {
					getPosition(e.coords);
					$.coords.text = 'Lat: ' + JSON.stringify(e.coords.latitude + 'Lon: ' + JSON.stringify(e.coords.longitude));
				}
			});

		} else {
			alert('Tillåt gpsen, tack');
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - get current position GPS");
	}
}
Alloy.Globals.getGPSpos = getGPSpos;

//-----------------------------------------------------------
// Hämtar enhetens position och kontrollerar mot punkter
//-----------------------------------------------------------
function getPosition(coordinatesObj) {
	try {
		gLat = coordinatesObj.latitude;
		gLon = coordinatesObj.longitude;

		isNearPoint();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - getPosition");
	}
}

//-----------------------------------------------------------
// Beräknar avståndet mellan enhetens koordinater och de punkter som håller info
//-----------------------------------------------------------
function distanceInM(lat1, lon1, GLat, GLon) {
	try {
		if (lat1 == null || lon1 == null || GLat == null || GLat == null) {
			alert("Det finns inga koordinater att titta efter");
		}

		var R = 6371;
		var a = 0.5 - Math.cos((GLat - lat1) * Math.PI / 180) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(GLat * Math.PI / 180) * (1 - Math.cos((GLon - lon1) * Math.PI / 180)) / 2;
		var distance = (R * 2 * Math.asin(Math.sqrt(a))) * 1000;

		return distance;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - distanceInM");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enhetens position är inom radien för en utsatt punkt
//-----------------------------------------------------------
function isInsideRadius(lat1, lon1, rad) {
	try {

		var isInside = false;
		var distance = distanceInM(lat1, lon1, gLat, gLon);

		if (distance <= rad) {
			isInside = true;
		}
		return isInside;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - isInsideRadius");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en punkt, sänder ut dialog om true
//-----------------------------------------------------------
function isNearPoint() {//type
	try {

		var dialog = Ti.UI.createAlertDialog();

		//if (type == 'hotspot') {
			var hotspotColl = Alloy.Collections.hotspotModel;
			hotspotColl.fetch();

			var jsonHotspot = hotspotColl.toJSON();

			for (var h = 0; h < jsonHotspot.length; h++) {

				var lat = jsonHotspot[h].latitude;
				var lon = jsonHotspot[h].longitude;
				var name = jsonHotspot[h].name;

				var radius = 10;

				if (isInsideRadius(lat, lon, radius)) {
					dialog.message = 'Nu börjar du närma dig ' + name + '!';
					dialog.ok = 'Läs mer';
					dialog.cancel = 'Stäng';
					dialog.title = '';
						
					dialog.show();
				}
			}
		//}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isNearPoint");
	}
}

