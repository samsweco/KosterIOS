// Ti.include("collectionData.js");

var foundJSON = [];

//-----------------------------------------------------------
// Hämtar hotspotCollection
//-----------------------------------------------------------
var hotspotColl = Alloy.Collections.hotspotModel;
hotspotColl.fetch();
var hotspotJSONobj = hotspotColl.toJSON();
Alloy.Globals.hotspotJSONobj = hotspotJSONobj;

//-----------------------------------------------------------
// Hämtar letterCollection och letterModel
//-----------------------------------------------------------
var lettersModel = Alloy.Models.letterModel;
var foundLettersModel = Alloy.Models.foundLettersModel;
var letterCollection = Alloy.Collections.letterModel;
letterCollection.fetch();
var letterJSON = letterCollection.toJSON();

//-----------------------------------------------------------
// Hämtar användarens position och startar location-event
// för påminnelser om sevärdheter eller bokstavsjakt
//-----------------------------------------------------------
function getUserPos(type) {
	try {
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
			if (type == 'boat') {
				Ti.Geolocation.addEventListener('location', addBoatLocation);
			}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - get current position GPS");
	}
}

var addLetterLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'letter');
		currentLocationFinder();
	}
};

var addHotspotLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'hotspot');
	}
};

var addBoatLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'boat');
	}
};

//-----------------------------------------------------------
// Avbryter location-event
//-----------------------------------------------------------
function stopGPS() {
	Titanium.Geolocation.removeEventListener('location', addHotspotLocation);
}

function stopGame() {
	Titanium.Geolocation.removeEventListener('location', addLetterLocation);
	lettersModel.destroy();
	foundLettersModel.destroy();
	startOver();
}

function stopBoatGPS() {
	Titanium.Geolocation.removeEventListener('location', addHotspotLocation);
}

Alloy.Globals.stopGPS = stopGPS;
Alloy.Globals.stopGame = stopGame;
Alloy.Globals.stopBoatGPS = stopBoatGPS;

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
		} else if (type == 'boat') {
			userOnBoatTrip();
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - set userPosition");
	}
}

function currentLocationFinder(){
    Titanium.Geolocation.getCurrentPosition(function(e){
        var currentRegion={
            latitude: e.coords.latitude,
            longitude: e.coords.longitude,
            animate:true,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002
        };
        
        interactiveMap.setLocation(currentRegion);
    });
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
// Kontrollerar om enheten är innanför en radie för en sevärdhet,
// sänder ut dialog om true
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

							var hotspotDetails = Alloy.createController("hotspotDetail", hotspotTxt).getView();
							Alloy.CFG.tabs.activeTab.open(hotspotDetails);
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

function userOnBoatTrip() {
	try {
		var boatdialog = Ti.UI.createAlertDialog({
			buttonNames : ['Läs mer', 'Stäng']
		});
		
		hotspotColl.fetch({
			query : 'SELECT * FROM hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID = 8'
		});
		var boatTripHotspots = hotspotColl.toJSON();

		for (var b = 0; b < boatTripHotspots.length; b++) {
			if (boatTripHotspots[b].alerted == 0) {
	
				var hotlat = boatTripHotspots[b].xkoord;
				var hotlon = boatTripHotspots[b].ykoord;
				var radius = boatTripHotspots[b].radie;

				if (isInsideRadius(hotlat, hotlon, radius)) {
					boatdialog.message = 'Nu börjar du närma dig ' + boatTripHotspots[b].name + '!';

					var hottitle = boatTripHotspots[b].name;
					var infoText = boatTripHotspots[b].infoTxt;
					var hotid = boatTripHotspots[b].id;

					boatdialog.addEventListener('click', function(e) {
						if (e.index == 0) {
							var hotspotTxt = {
								title : hottitle,
								infoTxt : infoText,
								id : hotid
							};

							var hotspotDetails = Alloy.createController("hotspotDetail", hotspotTxt).getView();
							Alloy.CFG.tabs.activeTab.open(hotspotDetails);
						}
					});

					boatdialog.show();
					playSound();
					boatTripHotspots[b].alerted = 1;					
				}
			}
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isNearPoint");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en radie för en bokstav,
// sänder ut dialog om true
//-----------------------------------------------------------
function userIsNearLetter() {
	try {
		var message = Ti.UI.createAlertDialog({
			title : 'Ny bokstav i närheten!',
			buttonNames : ['Gå till bokstavsjakten', 'Stäng']
		}); 

		for (var isnear = 0; isnear < Alloy.Globals.jsonCollection.length; isnear++) {
			if (Alloy.Globals.jsonCollection[isnear].alerted == 0){
				if (Alloy.Globals.jsonCollection[isnear].found == 0){
				
				var lat = Alloy.Globals.jsonCollection[isnear].latitude;
				var lon = Alloy.Globals.jsonCollection[isnear].longitude;
				var letterradius = Alloy.Globals.jsonCollection[isnear].radius;
				
				if (isInsideRadius(lat, lon, letterradius)) {
					var clue = Alloy.Globals.jsonCollection[isnear].clue;
					
					message.message = clue;
					message.addEventListener('click', function(e) {
						if (e.index == 0) {
								Alloy.CFG.tabs.setActiveTab(3);
							}
						});
						message.show();
					
						Alloy.Globals.jsonCollection[isnear].alerted = 1;
						playSound();
					}
				}	
			}		
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", 'isNearPoint - letter');
	}
}

//-----------------------------------------------------------
// Spelar upp ett ljud när man får en påminnelse
//-----------------------------------------------------------
function playSound() {
	try {
		var player = Ti.Media.createSound({
			url : "/sound/popcorn.m4a"
		});

		player.play();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", 'geofunctions - playsound');
	}
}

//-----------------------------------------------------------
// Lägger till de gröna plupparna på bokstavsjakt-kartan
//-----------------------------------------------------------
function addClueZone() {
	try {
		var zoneJSON = Alloy.Globals.jsonCollection;

		for (var c = 0; c < zoneJSON.length; c++) {
			var zoneAnnotation = MapModule.createAnnotation({
				latitude : zoneJSON[c].latitude,
				longitude : zoneJSON[c].longitude,
				image : '/images/' + (c+1) + 'green.png'
			});

			interactiveMap.addAnnotation(zoneAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - addClueZone");
	}
}

//-----------------------------------------------------------
// Sätter rätt region på karta utifrån var användaren befinner sig
//-----------------------------------------------------------
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

//-----------------------------------------------------------
// Push'ar in funna bokstäver i en array
//-----------------------------------------------------------
function getFound() {
	try {
		foundJSON = [];

		var foundLettersCollection = Alloy.Collections.foundLettersModel;
		foundLettersCollection.fetch({
			query : 'SELECT letter FROM foundLettersModel WHERE found = 1'
		});

		foundLetters = foundLettersCollection.toJSON();
		for (var f = 0; f < foundLetters.length; f++) {
			foundJSON.push(' ' + foundLetters[f].letter);
		}

		return foundJSON;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - getFound");
	}
}

//-----------------------------------------------------------
// Sparar till found 0 och tömmer bokstäverna så man kan spela igen
//-----------------------------------------------------------
function startOver() {
	try {
		for (var lid = 0; lid < foundJSON.length; lid++) {
			var letterid = lid + 1;

			foundLettersModel.fetch({
				'id' : letterid
			});

			foundLettersModel.set({
				'letter' : null,
				'found' : 0
			});

			foundLettersModel.save();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - startOver");
	}
}
Alloy.Globals.startOver = startOver;
