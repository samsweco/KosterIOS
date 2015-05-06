var args = arguments[0] || {};

var zoomedName = args.name;
var zoomColor = args.color;
var zoomLat = args.zoomlat;

var route;
var MapModule = require('ti.map');

var infospotsNotVisible = true;
var hotspotsNotVisible = true;

var infospotsAnnotation;
var hotspotAnnotation;

var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();
var jsonFileCollection = getJSONfiles();

var infospotCollection = Alloy.Collections.infospotCoordinatesModel;

// var infospotCollection = getInfospotCollection();

//-----------------------------------------------------------
// Onload-funktioner för kartan
//-----------------------------------------------------------
// try {
showMap();
setRoutes();
displayTrailMarkers();
// } catch(e) {
// newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - load page");
// }

//-----------------------------------------------------------
// Sätter ut alla vandringsleder på kartan
//-----------------------------------------------------------
function setRoutes() {
	try {
		trailsCollection.fetch({
			query : 'SELECT id, name, color FROM trailsModel'
		});

		var jsonObj = trailsCollection.toJSON();

		for (var i = 0; i < jsonObj.length; i++) {
			if (jsonObj[i].name != 'Båtleden') {
				var file = getFile(jsonObj[i].id);

				for (var u = 0; u < file.length; u++) {
					createMapRoutes(file[u].filename, jsonObj[i].name, jsonObj[i].color);
				}
			}
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "infoList - getInfoDetails");
	}
}

//-----------------------------------------------------------
// Hämtar JSON-fil för en vandringsled
//-----------------------------------------------------------
function getFile(id) {
	try {
		jsonFileCollection.fetch({
			query : 'SELECT filename FROM jsonFilesModel WHERE trailID ="' + id + '"'
		});

		var filename = jsonFileCollection.toJSON();
		return filename;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - getFile");
	}
}

//-----------------------------------------------------------
// Skapar en vandringsled på kartan
//-----------------------------------------------------------
function createMapRoutes(file, name, color) {
	try {
		var routes = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "/routes/" + file).read().text;
		var parsedRoute = JSON.parse(routes);

		var geoArray = [];
		geoArray.push(parsedRoute);

		for (var u = 0; u < geoArray.length; u++) {
			var coords = geoArray[0].features[0].geometry.paths[u];

			var points = new Array();

			for (var i = 0; i < coords.length; i++) {

				var c = {
					latitude : coords[i][1],
					longitude : coords[i][0]
				};
				points.push(c);
			}

			var route = {
				name : name,
				points : points,
				color : color,
				width : 1.7
			};
			baseMap.addRoute(MapModule.createRoute(route));
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - createMapRoutes");
	}
}

//-----------------------------------------------------------
// Läser in kartvyn
//-----------------------------------------------------------
function showMap() {
	try {
		baseMap = MapModule.createView({
			userLocation : true,
			mapType : MapModule.HYBRID_TYPE,
			animate : true,
			height : '100%',
			width : Ti.UI.FILL
		});
		
		setRegion();
		$.mapView.add(baseMap);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - showMap");
	}
}

function setRegion(){
	baseMap.region = {
		latitude : 58.886154,
		longitude : 11.024307,
		latitudeDelta : 0.1,
		longitudeDelta : 0.1
	}; 
	baseMap.animate = true;
}
Alloy.Globals.setRegion = setRegion;

//-----------------------------------------------------------
// Visar markers för vandringslederna
//-----------------------------------------------------------
function displayTrailMarkers() {
	try {
		trailsCollection.fetch({
			query : 'SELECT name, pinLon, pinLat, color, area, length, pincolor FROM trailsModel'
		});

		var jsonObj = trailsCollection.toJSON();
		for (var i = 0; i < jsonObj.length; i++) {
			var markerAnnotation = MapModule.createAnnotation({
				id : jsonObj[i].name,
				latitude : jsonObj[i].pinLat,
				longitude : jsonObj[i].pinLon,
				title : jsonObj[i].name,
				subtitle : jsonObj[i].area + ', ' + jsonObj[i].length + ' km',
				rightButton : '/pins/arrow.png',
				image : '/images/pin-' + jsonObj[i].pincolor + '.png',
				centerOffset : {
					x : 0,
					y : -25
				},
				name : 'trail',
				font : {
					fontStyle : 'Raleway-Light'
				}
			});

			baseMap.addAnnotation(markerAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayTrailMarkers");
	}
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
baseMap.addEventListener('click', function(evt) {

	if (evt.clicksource == 'rightButton') {
		if (evt.annotation.name == 'hotspot') {
			showHotspot(evt.annotation.id);
		} else {
			showTrail(evt.annotation.id);
		}
	}
});

baseMap.addEventListener('singletap', function() {
	Alloy.Globals.closeMapMenu();
});

function showMenu() {
	Alloy.Globals.showMenuWidget();
}

function getPos() {
	if(myPos == false){
		Alloy.Globals.setUserPosition();
		$.btnGetPosition.color = 'gray';
		myPos = true;
	}else{
		Alloy.Globals.setRegion();
		myPos = false;
	}
}

function setUserPosition() {
	Ti.Geolocation.getCurrentPosition(function(e) {
		if (e.coords != null) {
			baseMap.region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				latitudeDelta : 0.005,
				longitudeDelta : 0.005
			};
		}
	});
}

Alloy.Globals.setUserPosition = setUserPosition;
