var args = arguments[0] || {};

var zoomedName = args.name;
var zoomColor = args.color;
var zoomLat = args.zoomlat;

var route;
var radius = 10;
var MapModule = require('ti.map');

var infospotsNotVisible = true;
var hotspotsNotVisible = true;

var infospotsAnnotation;
var hotspotAnnotation;

var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();
var jsonFileCollection = getJSONfiles();
// var infospotCollection = getInfospotCollection();

//-----------------------------------------------------------
// Hämtar enhetens senaste GPS-position
// FUNGERAR MEN ÄR SJUKT STRÖRANDE
//-----------------------------------------------------------
try {
	Ti.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			alert('Get current position' + e.error);
		} else {
		}
	});

	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.distanceFilter = 10;
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

		Ti.Geolocation.addEventListener('location', function(e) {
			if (e.error) {
				alert('Add eventlistener!' + e.error);
			} else {
				getPosition(e.coords);
				
				Ti.API.info('e : ' + JSON.stringify(e.coords));
			}
		});
	} else {
		alert('Tillåt gpsen, tack');
	}
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - get current position GPS");
}

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
			var file = getFile(jsonObj[i].id);

			for (var u = 0; u < file.length; u++) {
				createMapRoutes(file[u].filename, jsonObj[i].name, jsonObj[i].color);
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
				width : 2.0
			};
			baseMap.addRoute(MapModule.createRoute(route));
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - createMapRoutes");
	}
}

//-----------------------------------------------------------
// Hämtar enhetens position och kontrollerar mot punkter
//-----------------------------------------------------------
function getPosition(coordinatesObj) {
	try {
		gLat = coordinatesObj.latitude;
		gLon = coordinatesObj.longitude;

		isNearPoint();
	} catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "map - getPosition");
		newError('error : ', e);
	}
}

//-----------------------------------------------------------
// Beräknar avståndet mellan enhetens koordinater och de punkter som håller info
//-----------------------------------------------------------
function distanceInM(lat1, lon1, GLat, GLon) {
	try {
		if (lat1 == null || lon1 == null || GLat == null || GLat == null) {
			Ti.API.info("Det finns inga koordinater att titta efter");
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
function isNearPoint() {
	// try {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch();

	var jsonCollection = letterCollection.toJSON();

	for (var i = 0; i < jsonCollection.length; i++) {
		var lat = jsonCollection[i].latitude;
		var lon = jsonCollection[i].longitude;
		
		if (isInsideRadius(lat, lon, radius)) {
			Alloy.Globals.showInteractive();
			foundId = jsonCollection[i].id;
		}
	}
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "map - isNearPoint");
	// }
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
			region : {
				latitude : 58.893539,
				longitude : 11.012579,
				latitudeDelta : 0.08,
				longitudeDelta : 0.08
			},
			height : '100%',
			width : Ti.UI.FILL
		});

		$.mapView.add(baseMap);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - showMap");
	}
}

//-----------------------------------------------------------
// Visar markers för vandringslederna
//-----------------------------------------------------------
function displayTrailMarkers() {
	try {
		trailsCollection.fetch({
			query : 'SELECT name, pinLon, pinLat, color FROM trailsModel'
		});

		var jsonObj = trailsCollection.toJSON();
		for (var i = 0; i < jsonObj.length; i++) {
			var markerAnnotation = MapModule.createAnnotation({
				id : jsonObj[i].name,
				latitude : jsonObj[i].pinLat,
				longitude : jsonObj[i].pinLon,
				title : jsonObj[i].name,
				pincolor : MapModule.ANNOTATION_GREEN,
				subtitle : 'Läs mer om ' + jsonObj[i].name + ' här!',
				rightButton : '/pins/arrow.png',
				name : 'trail',
				font : {
					fontFamily : 'Gotham Rounded'
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

function setUserPosition() {

	Ti.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			alert('error : ' + e.error);
			setUserPosition();
		}

		// var myPosition = MapModule.createAnnotation({
		// latitude : e.coords.latitude,
		// longitude : e.coords.longitude,
		// image : '/images/currentposition.png'
		// });
		//
		// baseMap.addAnnotation(myPosition);
	});

	// var myPosition = MapModule.createAnnotation({
	// latitude : ,
	// longitude : ,
	// image : 'currentposition.png'
	// });
	//
	// baseMap.addAnnotation(myPosition);
}

Alloy.Globals.setUserPosition = setUserPosition;

