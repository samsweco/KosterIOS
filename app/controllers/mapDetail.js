var args = arguments[0] || {};

//-----------------------------------------------------------
// args från annan controller
//-----------------------------------------------------------
var zoomName = args.title;
var zoomColor = args.color;
var zoomLat = args.zoomlat;
var zoomLon = args.zoomlon;
var zoomId = args.id;

var radius = 10;
var zoomedMap;
var MapModule = require('ti.map');

var trailsCollection = getTrailsCollection();

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
showMap();
setRoute();
displayTrailMarkers();

//-----------------------------------------------------------
// Läsa in kartvyn
//-----------------------------------------------------------
function showMap() {
	try {
		baseMap = MapModule.createView({
			userLocation : true,
			mapType : MapModule.SATELLITE_TYPE,
			animate : true,
			region : {
				latitude : zoomLat,
				longitude : zoomLon,
				latitudeDelta : 0.03,
				longitudeDelta : 0.03
			},
			height : '90%',
			width : Ti.UI.FILL
		});

		$.mapDetailView.add(baseMap);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - showMap");
	}
};

//-----------------------------------------------------------
// Beräknar nivån av inzoomning på en vald led
//-----------------------------------------------------------
function calculateMapRegion(trailCoordinates) {
	try {
		if (trailCoordinates.length != 0) {
			var poiCenter = {};
			var delta = 0.02;
			var minLat = trailCoordinates[0].latitude,
			    maxLat = trailCoordinates[0].latitude,
			    minLon = trailCoordinates[0].longitude,
			    maxLon = trailCoordinates[0].longitude;
			for (var i = 0; i < trailCoordinates.length - 1; i++) {
				minLat = Math.min(trailCoordinates[i + 1].latitude, minLat);
				maxLat = Math.max(trailCoordinates[i + 1].latitude, maxLat);
				minLon = Math.min(trailCoordinates[i + 1].longitude, minLon);
				maxLon = Math.max(trailCoordinates[i + 1].longitude, maxLon);
			}

			var deltaLat = maxLat - minLat;
			var deltaLon = maxLon - minLon;

			delta = Math.max(deltaLat, deltaLon);
			//Change multiplier if it's too close
			delta = delta * 1.2;

			poiCenter.lat = maxLat - parseFloat((maxLat - minLat) / 2);
			poiCenter.lon = maxLon - parseFloat((maxLon - minLon) / 2);

			region = {
				latitude : poiCenter.lat,
				longitude : poiCenter.lon,
				latitudeDelta : delta,
				longitudeDelta : delta
			};
		}
		return region;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - calculateMapRegion");
	}

}

//-----------------------------------------------------------
// sätter en vald vandingsled
//-----------------------------------------------------------
function setRoute() {
	try {

		var file = getFile(zoomId);

		for (var u = 0; u < file.length; u++) {
			createMapRoutes(file[u].filename, zoomName, zoomColor);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - setRoute");
	}
}

//-----------------------------------------------------------
// skapar vandringsleden och sätter den på kartan
//-----------------------------------------------------------
function createMapRoutes(file, name, color) {
	try {
		var zoomedRoute = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "/routes/" + file).read().text;
		var parsedRoute = JSON.parse(zoomedRoute);

		var geoArray = [];
		geoArray.push(parsedRoute);

		var coordArray = [];

		for (var u = 0; u < geoArray.length; u++) {
			var coords = geoArray[0].features[0].geometry.paths[u];

			for (var i = 0; i < coords.length; i++) {

				var point = {
					latitude : coords[i][1],
					longitude : coords[i][0]
				};
				coordArray.push(point);
			}

			var route = {
				name : name,
				points : coordArray,
				color : color,
				width : 2.0
			};
			baseMap.addRoute(MapModule.createRoute(route));
		}

		baseMap.region = calculateMapRegion(coordArray);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - createMapRoute");
	}
}

//-----------------------------------------------------------
// Hämtar JSON-filen för den valda vandringsleden
//-----------------------------------------------------------
function getFile() {
	try {

		var jsonFileCollection = Alloy.Collections.jsonFilesModel;
		jsonFileCollection.fetch({
			query : 'SELECT filename FROM jsonFilesModel WHERE trailID ="' + zoomId + '"'
		});

		var filename = jsonFileCollection.toJSON();
		return filename;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - getFile");
	}
}

//-----------------------------------------------------------
// Sätter ut en marker för den valda vandringsleden
//-----------------------------------------------------------
function displayTrailMarkers() {
	try {
		trailsCollection.fetch({
			query : 'SELECT name, pin, pinLon, pinLat FROM trailsModel where id ="' + zoomId + '"'
		});

		var jsonObj = trailsCollection.toJSON();
		for (var i = 0; i < jsonObj.length; i++) {
			var markerAnnotation = MapModule.createAnnotation({
				id : jsonObj[i].name,
				latitude : jsonObj[i].pinLat,
				longitude : jsonObj[i].pinLon,
				title : jsonObj[i].name,
				subtitle : jsonObj[i].name + ' startar här!'
			});

			baseMap.addAnnotation(markerAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - displayTrailMarkers");
	}
}
 
//-----------------------------------------------------------
// Lägger till eventlistener för klick på hotspot
//-----------------------------------------------------------
try {
	baseMap.addEventListener('click', function(evt) {
		if (evt.clicksource == 'rightButton') {
			var hotspotCollection = Alloy.Collections.hotspotModel;
			hotspotCollection.fetch({
				query : 'SELECT id, infoTxt from hotspotModel where name = "' + evt.annotation.id + '"'
			});

			var jsonObj = hotspotCollection.toJSON();

			var hotspotTxt = {
				title : evt.annotation.id,
				infoTxt : jsonObj[0].infoTxt,
				id : jsonObj[0].id
			};

			var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
			Alloy.CFG.tabs.activeTab.open(hotspotDetail);
		};
	});
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - addEventListener");
}