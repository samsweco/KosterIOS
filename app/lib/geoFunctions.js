var hotspotColl = Alloy.Collections.hotspotModel;
hotspotColl.fetch();
var hotspotJSONobj = hotspotColl.toJSON();
Alloy.Globals.hotspotJSONobj = hotspotJSONobj;

function getUserPos(type) {
	try {

		if (Ti.Geolocation.locationServicesEnabled) {
			Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
			Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS;
			Titanium.Geolocation.pauseLocationUpdateAutomatically = true;
			Titanium.Geolocation.distanceFilter = 3;

			if (type == 'hotspot') {
				Ti.Geolocation.addEventListener('location', addHotspotLocation);
			}

			if (type == 'letter') {
				Ti.Geolocation.addEventListener('location', addLetterLocation);
			}

		} else {
			alert('Tillåt gpsen, tack');
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - get current position GPS");
	}
}

var addLetterLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'letter');
	}
};

var addHotspotLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'hotspot');
	}
};

//-----------------------------------------------------------
// Hämtar enhetens position och kontrollerar mot punkter
//-----------------------------------------------------------
function setUserPosition(userCoordinates, type) {
	try {
		gLat = userCoordinates.latitude;
		gLon = userCoordinates.longitude;

		if (type == 'hotspot') {
			userIsNearHotspot();
		} else if (type == 'letter') {
			userIsNearLetter();
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - getPosition");
	}
}

function stopGPS() {
	Titanium.Geolocation.removeEventListener('location', addHotspotLocation);
	Titanium.Geolocation.removeEventListener('location', addLetterLocation);
}

//-----------------------------------------------------------
// Beräknar avståndet mellan enhetens koordinater och de punkter som håller info
//-----------------------------------------------------------
function distanceM(latt, lonn, GlobalLat, GlobalLon) {
	try {
		if (latt == null || lonn == null || GlobalLat == null || GlobalLon == null) {
			alert("Det finns inga koordinater att titta efter");
		}

		var R = 6371;
		var a = 0.5 - Math.cos((GlobalLat - latt) * Math.PI / 180) / 2 + Math.cos(latt * Math.PI / 180) * Math.cos(GlobalLat * Math.PI / 180) * (1 - Math.cos((GlobalLon - lonn) * Math.PI / 180)) / 2;
		var distanceInM = (R * 2 * Math.asin(Math.sqrt(a))) * 1000;

		return distanceInM;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - distanceInM");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enhetens position är inom radien för en utsatt punkt
//-----------------------------------------------------------
function isInsideRadius(latti, lonni, rad) {
	try {

		var inside = false;
		var distance = distanceM(latti, lonni, gLat, gLon);

		if (distance <= rad) {
			inside = true;
		}
		return inside;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isInsideRadius");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en punkt, sänder ut dialog om true
//-----------------------------------------------------------
function userIsNearHotspot() {
	try {
		var dialog = Ti.UI.createAlertDialog();

		for (var h = 0; h < Alloy.Globals.hotspotJSONobj.length; h++) {

			if (Alloy.Globals.hotspotJSONobj[h].alerted == 0) {

				var hotlat = Alloy.Globals.hotspotJSONobj[h].xkoord;
				var hotlon = Alloy.Globals.hotspotJSONobj[h].ykoord;
				var radius = Alloy.Globals.hotspotJSONobj[h].radie;

				if (isInsideRadius(hotlat, hotlon, radius)) {
					dialog.message = 'Nu börjar du närma dig ' + Alloy.Globals.hotspotJSONobj[h].name + '!';
					dialog.buttonNames = ['Läs mer', 'Stäng'];

					var hottitle = Alloy.Globals.hotspotJSONobj[h].name;
					var infoText = Alloy.Globals.hotspotJSONobj[h].infoTxt;
					var hotid = Alloy.Globals.hotspotJSONobj[h].id;

					dialog.addEventListener('click', function(e) {
						if (e.index == 0) {
							var hotspotTxt = {
								title : hottitle,
								infoTxt : infoText,
								id : hotid
							};

							var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
							Alloy.CFG.tabs.activeTab.open(hotspotDetail);
						}
					});

					dialog.show();
					playSound();
					Alloy.Globals.hotspotJSONobj[h].alerted = 1;
				}
			}
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isNearPoint");
	}
}

//-----------------------------------------------------------
// Sätter ut punkterna som ska kontrolleras, loopar
//-----------------------------------------------------------
function userIsNearLetter() {
	try {
		for (var i = 0; i < Alloy.Globals.jsonCollection.length; i++) {

			if (Alloy.Globals.jsonCollection[i].found == 0) {

				var lat = Alloy.Globals.jsonCollection[i].latitude;
				var lon = Alloy.Globals.jsonCollection[i].longitude;
				foundId = Alloy.Globals.jsonCollection[i].id;
				var radius = Alloy.Globals.jsonCollection[i].radius;

				if (isInsideRadius(lat, lon, radius) && Alloy.Globals.jsonCollection[i].alerted == 0) {

					var message = Ti.UI.createAlertDialog();

					// if (foundId != nextId) {
						// message.message = "Nu går du åt fel håll. Börja din vandring uppför backen vid naturum.";
						// message.title = "Fel väg";
						// message.buttonNames = ['Stäng'];
					// } else {
						message.message = Alloy.Globals.jsonCollection[i].clue;
						message.title = 'Ny bokstav i närheten!';
						message.buttonNames = ['Gå till bokstavsjakten', 'Stäng'];

						message.addEventListener('click', function(e) {
							if (e.index == 0) {
								Alloy.CFG.tabs.setActiveTab(3);
							}
						});

						
					// }

					message.show();
					playSound();
					Alloy.Globals.jsonCollection[i].alerted = 1;
				}
			}
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", 'isNearPoint - letter');
	}
}

function playSound() {
	var player = Ti.Media.createSound({
		url : "/sound/popcorn.m4a"
	});

	player.play();
}

function getPosition(maptype) {
	Ti.Geolocation.getCurrentPosition(function(e) {
		if (e.coords != null) {
			maptype.region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				latitudeDelta : 0.007,
				longitudeDelta : 0.007
			};
			maptype.animate = true;
			maptype.userLocation = true;
		}
	});
}