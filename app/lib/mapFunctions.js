
var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();
var letterCollection = getLetterCollection();
letterCollection.fetch();
var jsonCollection = letterCollection.toJSON();
Alloy.Globals.jsonCollection = jsonCollection;

var hotspotsNotVisible = true;
var radius = 20;
var nextId = 1;
var infospotArray = [];
var menuVisible = false;
var mapMenuVisible = false;

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspot(myId) {
	try {
		hotspotCollection.fetch({
			query : 'SELECT id, infoTxt FROM hotspotModel where name = "' + myId + '"'
		});

		var jsonObjHot = hotspotCollection.toJSON();

		var hotspotTxt = {
			title : myId,
			infoTxt : jsonObjHot[0].infoTxt,
			id : jsonObjHot[0].id
		};

		var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		Alloy.CFG.tabs.activeTab.open(hotspotDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - showHotspot");
	}
}

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displayAllMarkers() {
	try {
		var markerHotspotArray = [];
		hotspotCollection.fetch();

		var markersJSON = hotspotCollection.toJSON();
		for (var u = 0; u < markersJSON.length; u++) {

			var markerHotspot = MapModule.createAnnotation({
				id : markersJSON[u].name,
				latitude : markersJSON[u].xkoord,
				longitude : markersJSON[u].ykoord,
				title : markersJSON[u].name,
				subtitle : 'Läs mer om ' + markersJSON[u].name + ' här!',
				image : '/images/hot-icon-azure.png',
				centerOffset : {
					x : -3,
					y : -16
				},
				rightButton : '/images/arrow.png',
				name : 'hotspot'
			});

			markerHotspotArray.push(markerHotspot);
		}

		return markerHotspotArray;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayMarkers");
	}
}

//-----------------------------------------------------------
// Visar ikoner för alla informationsobjekt
//-----------------------------------------------------------
function displayInfoSpots(type) {

	try {
		var markerArray = [];
		var infospotCollection = getInfoSpotCoordinatesCollection();
		infospotCollection.fetch({
			query : 'SELECT name, latitude, longitude FROM infospotCoordinatesModel WHERE name ="' + type + '"'
		});

		var infospotJSON = infospotCollection.toJSON();

		for (var i = 0; i < infospotJSON.length; i++) {
			var infoMarker = MapModule.createAnnotation({
				latitude : infospotJSON[i].latitude,
				longitude : infospotJSON[i].longitude,
				image : '/images/map_' + infospotJSON[i].name + '.png'
			});

			if (infospotJSON[i].name == 'taltplats') {
				infoMarker.title = 'Tältplats';
			} else if (infospotJSON[i].name == 'farjelage') {
				infoMarker.title = 'Färjeläge';
			} else {
				infoMarker.title = capitalizeFirstLetter(infospotJSON[i].name);
			}

			markerArray.push(infoMarker);
			infospotArray.push(infoMarker);
		}

		return markerArray;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayInfoSpots");
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeAnnoSpot(anno, infotype) {

	for (var o = 0; o < infospotArray.length; o++) {
		var type = infospotArray[o].title;
		if (anno == 'info' && infotype == type) {
			baseMap.removeAnnotation(infospotArray[o]);
		}
	}
}

function removeAnnoHotspot() {
	var anno = displayAllMarkers();
	for (var o = 0; o < anno.length; o++) {
		baseMap.removeAnnotation(anno[o].title);
	}
}