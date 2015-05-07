Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};

var zoomedName = args.name;
var zoomColor = args.color;
var zoomLat = args.zoomlat;

// var infospotsNotVisible = true;
// var hotspotsNotVisible = true;
// 
// var infospotsAnnotation;
// var hotspotAnnotation;

var trailsCollection = getTrailsCollection();
// var hotspotCollection = getHotspotCollection();
// var jsonFileCollection = getJSONfiles();
// var infospotCollection = getInfoSpotCoordinatesCollection();

//-----------------------------------------------------------
// Onload-funktioner för kartan
//-----------------------------------------------------------
// try {
displayBigMap();
setRoutes();
displayTrailMarkers();
// } catch(e) {
// newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - load page");
// }

function displayBigMap(){
	$.mapView.add(showMap());
}

//-----------------------------------------------------------
// Öppnar trailDetail med info om vald vandringsled
//-----------------------------------------------------------
function showTrail(myId) {
	try {
		trailsCollection.fetch({
			query : 'SELECT * FROM trailsModel where name ="' + myId + '"'
		});

		var jsonObjTr = trailsCollection.toJSON();

		var args = {
			id : jsonObjTr[0].id,
			title : myId,
			length : jsonObjTr[0].length,
			infoTxt : jsonObjTr[0].infoTxt,
			area : jsonObjTr[0].area,
			color : jsonObjTr[0].color,
			zoomlat : jsonObjTr[0].zoomLat,
			zoomlon : jsonObjTr[0].zoomLon
		};

		var trailDetail = Alloy.createController("trailDetail", args).getView();
		Alloy.CFG.tabs.activeTab.open(trailDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - showTrail");
	}
}

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
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
map.addEventListener('click', function(evt) {

	if (evt.clicksource == 'rightButton') {
		if (evt.annotation.name == 'hotspot') {
			showHotspot(evt.annotation.id);
		} else {
			showTrail(evt.annotation.id);
		}
	}
});

map.addEventListener('singletap', function() {
	Alloy.Globals.closeMapMenu();
});

function setUserPosition() {
	Ti.Geolocation.getCurrentPosition(function(e) {
		if (e.coords != null) {
			map.region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				latitudeDelta : 0.008,
				longitudeDelta : 0.008
			};
			map.animate = true;
			map.userLocation = true;
		}
	});
}

Alloy.Globals.setUserPosition = setUserPosition;
