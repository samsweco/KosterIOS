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

function getInfospotCollection() {
	var infospotCollection = Alloy.Collections.infospotModel;
	return infospotCollection;
}

function getLetterCollection() {
	var letterCollection = Alloy.Collections.letterModel;
	return letterCollection;
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
var word = 'sam';
var globalTrailID = 0;

var interactiveVisible = false;

var snorkel = false;
var torrdass = false;
var utsiktsplats = false;
var wc = false;
var rastplats = false;
var taltplats = false;
var badplats = false;
var information = false;
var eldplats = false;




//-----------------------------------------------------------
// Visar ikoner för alla informationsobjekt
//-----------------------------------------------------------
function displayInfoSpots(type) {
	try {
		var markerArray = [];
		var infospotCollection = getInfospotCollection();
		infospotCollection.fetch({
			query : 'select * from infospotCoordinatesModel WHERE name ="' + type + '"'
		});

		var infoJSON = infospotCollection.toJSON();
		for (var u = 0; u < infoJSON.length; u++) {
			var marker = MapModule.createAnnotation({
				latitude : infoJSON[u].latitude,
				longitude : infoJSON[u].longitude,
				image : '/images/map_' + infoJSON[u].name + '.png'
			});

			if (infoJSON[u].name == 'taltplats') {
				marker.title = 'Tältplats';
			} else if (infoJSON[u].name == 'wc') {
				marker.title = 'WC';
			} else {
				marker.title = capitalizeFirstLetter(infoJSON[u].name);
			}

			markerArray.push(marker);
		}

		return markerArray;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayInfoSpots");
	}
}

function removeInfoSpot(infotype) {
	var arrayInfo = displayInfoSpots(infotype);
	// Ti.API.info('array : ' + JSON.stringify(arrayInfo[0].id));
	// baseMap.removeAnnotations(arrayInfo);

	for (var o = 0; o < arrayInfo.length; o++) {
		// Ti.API.info('arrayTitle : ' + JSON.stringify(arrayInfo[info].title));
		baseMap.removeAnnotation(arrayInfo[o].title);
	}
}

