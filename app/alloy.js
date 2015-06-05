// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:

//-----------------------------------------------------------
// Globala variabler
//-----------------------------------------------------------
var gLat = 0;
var gLon = 0;
var lat = null;
var lon = null;
var foundId = 1;
var nextId = 1;
var foundJSON = [];
var alertedArray = [];
var foundLetterId = 1;
var letterJSON;

var globalTrailID = 0;
var word = 'ÖRONMANET';

var interactiveVisible = false;
var menuMapVisible = false;

var hotspotGPS = false;
var interactiveGPS = false;
var boatGPS = false;

var infospotArray = [];
var markerHotspotArray = [];

//-----------------------------------------------------------
// Globala variabler för att visa och släcka infospots
//-----------------------------------------------------------
var farjelage = false;
var snorkel = false;
var torrdass = false;
var utsiktsplats = false;
var rastplats = false;
var taltplats = false;
var badplats = false;
var information = false;
var eldplats = false;

//-----------------------------------------------------------
// Variabel för kartvyer
//-----------------------------------------------------------
var MapModule = require('ti.map');
var map = MapModule.createView({
	mapType : MapModule.HYBRID_TYPE,
	animate : true,
	height : '100%',
	width : Ti.UI.FILL
});
var detailMap = MapModule.createView({
	mapType : MapModule.HYBRID_TYPE,
	animate : true,
	height : '100%',
	width : Ti.UI.FILL
});
var interactiveMap = MapModule.createView({
	mapType : MapModule.HYBRID_TYPE,
	animate : true,
	height : '100%',
	width : Ti.UI.FILL,
	userLocation : true
});

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
// Avsluta GPS när man stänger appen
//-----------------------------------------------------------
Titanium.App.addEventListener('close', function() {
	
	gLat = null;
	gLon = null;
	
	if(hotspotGPS){
		Alloy.Globals.stopGPS();
	} 
	if(interactiveGPS){
		Alloy.Globals.stopGame();
	} 
	if(boatGPS){
		Alloy.Globals.stopBoatGPS();
	}
});