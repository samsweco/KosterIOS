// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var alerted = false;
//-----------------------------------------------------------
// Globala variabler för geofencing.
//-----------------------------------------------------------
var gLat = 0;
var gLon = 0;
var foundId = 1;
var notify = true;

//-----------------------------------------------------------
// Array som håller bokstäverna från bokstavsjakten.
//-----------------------------------------------------------
var lettersArray = [];
var globalTrailID = 0;

var interactiveVisible = false;

var farjelage = false;
var snorkel = false;
var torrdass = false;
var utsiktsplats = false;
var rastplats = false;
var taltplats = false;
var badplats = false;
var information = false;
var eldplats = false;

//SANDRA TA BORT SEN, BARA TEST

//-----------------------------------------------------------
// Variabel för kartvyn
//-----------------------------------------------------------

var MapModule = require('ti.map');
var baseMap;

//-----------------------------------------------------------
// Metoder för alla collections
//-----------------------------------------------------------

function getHotspotCollection() {
	var hotspotCollection = Alloy.Collections.hotspotModel;
	return hotspotCollection;
}

function getMediaCollection() {
	var mediaCollection = Alloy.Collections.mediaModel;
	return mediaCollection;
}

function getTrailsCollection() {
	var trailCollection = Alloy.Collections.trailsModel;
	return trailCollection;
}

function getInfoCollection() {
	var infoCollection = Alloy.Collections.infoModel;
	return infoCollection;
}

function getJSONfiles() {
	var jsonFileCollection = Alloy.Collections.jsonFilesModel;
	return jsonFileCollection;
}

function getLetterCollection() {
	var letterCollection = Alloy.Collections.letterModel;
	return letterCollection;
}

function getInfoSpotCoordinatesCollection(){
	var infospotCollection = Alloy.Collections.infospotCoordinatesModel;
	return infospotCollection;
}

//-----------------------------------------------------------
// Felhantering
//-----------------------------------------------------------
function newError(errorMsg, pageName) {
	try {
		var er = new Error(errorMsg);
		er.myObject = pageName;
		throw er;
	} catch (e) {

		alert("Error:[" + e.message + "] has occured on " + e.myObject + " page.");
	}
}



//GEO STUFF
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
function getGPSpos(type) {
	try {
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
				Ti.API.info('Get current position' + e.error);
				//getGPSpos();
			}
		});

		if (Ti.Geolocation.locationServicesEnabled) {
			Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
			Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS;
			// Titanium.Geolocation.pauseLocationUpdateAutomatically = true;
			Titanium.Geolocation.distanceFilter = 3;

			Ti.Geolocation.addEventListener('location', function(e) {
				if (!e.error) {
					getPosition(e.coords, type);
					// $.coords.text = 'Lat: ' + JSON.stringify(e.coords.latitude + 'Lon: ' + JSON.stringify(e.coords.longitude));
				}
			});

		} else {
			alert('Tillåt gpsen, tack');
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - get current position GPS");
	}
}

Alloy.Globals.getGPSpos = getGPSpos;

//-----------------------------------------------------------
// Hämtar enhetens position och kontrollerar mot punkter
//-----------------------------------------------------------
function getPosition(coordinatesObj, type) {
	// try {
	gLat = coordinatesObj.latitude;
	gLon = coordinatesObj.longitude;

	isNearPoint(type);
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - getPosition");
	// }
}

//-----------------------------------------------------------
// Beräknar avståndet mellan enhetens koordinater och de punkter som håller info
//-----------------------------------------------------------
function distanceInM(lat1, lon1, GLat, GLon) {
	try {
		if (lat1 == null || lon1 == null || GLat == null || GLat == null) {
			// alert("Det finns inga koordinater att titta efter");
		}

		var R = 6371;
		var a = 0.5 - Math.cos((GLat - lat1) * Math.PI / 180) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(GLat * Math.PI / 180) * (1 - Math.cos((GLon - lon1) * Math.PI / 180)) / 2;
		var distance = (R * 2 * Math.asin(Math.sqrt(a))) * 1000;

		return distance;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - distanceInM");
	}
}
//Alloy.Globals.distanceInM = distanceInM;

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
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isInsideRadius");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en punkt, sänder ut dialog om true
//-----------------------------------------------------------
function isNearPoint(type) {
	// try {
	var radius = 30;
	var dialog = Ti.UI.createAlertDialog();

	if (type == 'hotspot') {
		var hotspotColl = Alloy.Collections.hotspotModel;
		hotspotColl.fetch({
			query : 'SELECT DISTINCT id, name, infoTxt, xkoord, ykoord FROM hotspotModel'
		});

		var jsonHotspot = hotspotColl.toJSON();
		//Ti.API.info('jsonhot : ' + JSON.stringify(jsonHotspot));

		for (var h = 0; h < jsonHotspot.length; h++) {

			var lat = jsonHotspot[h].xkoord;
			var lon = jsonHotspot[h].ykoord;
			// var name = jsonHotspot[h].name;
			// var txt = jsonHotspot[h].infoTxt;
			// var hotid = jsonHotspot[h].id;

			

			if (isInsideRadius(lat, lon, radius)) {
				dialog.message = 'Nu börjar du närma dig ' + jsonHotspot[h].name + '!';
				dialog.buttonNames = ['Läs mer', 'Stäng'];

				dialog.addEventListener('click', function(e) {
					if (e.index == 0) {
						var hotspotTxt = {
							title : jsonHotspot[h].name,
							infoTxt : jsonHotspot[h].infoTxt,
							id : jsonHotspot[h].id
						};

						var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
						Alloy.CFG.tabs.activeTab.open(hotspotDetail);
					}
				});

				dialog.show();
			}
		}
	} else if (type == 'interactive') {
		// var letterColl = Alloy.Collections.letterModel;
		// letterColl.fetch({
			// query : 'SELECT DISTINCT id, latitude, longitude, clue, found, radie FROM letterModel'
		// });

		// var jsonLetters = letterColl.toJSON();
		
	//	Ti.API.info('jsonLetters : ' + JSON.stringify(Alloy.Globals.jsonCollection));

		for (var l = 0; l < Alloy.Globals.jsonCollection[0]; l++) {

			var letterlati = Alloy.Globals.jsonCollection[l].latitude;
			var letterlongi = Alloy.Globals.jsonCollection[l].longitude;
			//var letterradie = Alloy.Globals.jsonCollection[l].radie;

			if (isInsideRadius(letterlati, letterlongi, radius)) {
				if (Alloy.Globals.jsonCollection[l].found == 0) {
					
					alert('Ny bokstav');
					// dialog.message = 'Nu börjar du närma dig en ny bokstav! Gå tillbaka till spelet för att se den.';
					// dialog.buttonNames = ['Stäng'];
					// dialog.show();

					Alloy.Globals.jsonCollection[l].found = 1;
				}
			}
		}
	}
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isNearPoint");
	// }
}

Alloy.Globals.isNearPoint = isNearPoint;
