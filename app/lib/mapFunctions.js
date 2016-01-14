Ti.include("collectionData.js");


var markerSpecHotspotArray = [];
var hotspotDetail;

var hotspotClicked = 0;

//-----------------------------------------------------------
// Hämtar trailsCollection
//-----------------------------------------------------------
try {
	var trailJson = returnTrails();
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - trailCollectionFetches"); 
}

//-----------------------------------------------------------
// Hämtar hotspotCollection
//-----------------------------------------------------------
try {
	var hotspotCollection = returnHotspots();
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - hotspotCollectionFetches");
}

//-----------------------------------------------------------
// Läser in kartvyn
//-----------------------------------------------------------
function showMap(maptype) {
	try {
		setRoutes(maptype);
		setRegion(maptype);
		displayTrailMarkers(maptype);
		
		return map;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - showMap");
	}
}

//-----------------------------------------------------------
// Rensar kartan och laddar om pins
//-----------------------------------------------------------
function reloadMap(){
	map.removeAllAnnotations();
	showMap(map);
}

//-----------------------------------------
// Zoomar in kartan på en Detaljkarta
//-----------------------------------------
function showDetailMap(maptype, id, name, color) {
	try {
		setSpecificRoute(maptype, id, name, color);
		return maptype;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - showDetailMap");
	}
}

//-----------------------------------------------------------
// sätter en vald vandingsled
//-----------------------------------------------------------
function setSpecificRoute(maptype, id, name, color) {
	try {
		if (id != 8) {
			var file = returnJsonFiles(id);

			for (var u = 0; u < file.length; u++) {
				createMapRoutes(maptype, file[u].filename, name, color);
			}
		} else {
			maptype.region = {
				latitude : 58.907482,
				longitude : 11.104129,
				latitudeDelta : 0.1,
				longitudeDelta : 0.1
			};
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - setSpecRoutes");
	}
}

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
			// Ändra om det ska vara mer zoomat
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
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - calculateMapRegion");
	}
}

//-----------------------------------------------------------
// skapar vandringsleden och sätter den på kartan
//-----------------------------------------------------------
function createMapRoutes(maptype, file, name, color) {
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
				width : 2.0,
				color : color
			};
			
			maptype.addRoute(MapModule.createRoute(route));
		}
		
		if(maptype != hotspotMap){
			maptype.region = calculateMapRegion(coordArray);
		}
		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - createMapRoute");
	}
}

//-----------------------------------------------------------
// Sätter ut alla vandringsleder på kartan
//-----------------------------------------------------------
function setRoutes(maptype) {
	try {
		for ( i = 0; i < trailJson.length; i++) {
			setSpecificRoute(maptype, trailJson[i].id, trailJson[i].name, trailJson[i].color);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - setRoutes");
	}
}

//-----------------------------------------------------------
// Visar markers för vandringslederna
//-----------------------------------------------------------
function displayTrailMarkers(maptype) {
	try {
		for (var i = 0; i < trailJson.length; i++) {
			var markerAnnotation = MapModule.createAnnotation({
				id : trailJson[i].name,
				latitude : trailJson[i].pinLat,
				longitude : trailJson[i].pinLon,
				title : trailJson[i].name,
				subtitle : trailJson[i].area + ', ' + trailJson[i].length + ' km',
				rightButton : '/images/arrow.png',
				centerOffset : {
					x : 0,
					y : -15
				},
				name : 'trail',
				font : {
					fontStyle : 'Raleway-Light'
				}
			});
			
			if(trailJson[i].name != 'Båtresan'){
				markerAnnotation.image = '/images/pin-' + trailJson[i].pincolor + '.png';
			} else {
				markerAnnotation.image = '/images/map_farjelage.png';
			}

			maptype.addAnnotation(markerAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - displayTrailMarkers");
	}
}

//-----------------------------------------------------------
// Skapar karta för en specifik hotspot
//-----------------------------------------------------------
function showHotspotOnMap(lat, longi, hotspotId) {		
	try {
		hotspotMap.region = {
			latitude : lat,
			longitude : longi,
			latitudeDelta : 0.009,
			longitudeDelta : 0.009
		};
		
		var specifikHotspotMarker = MapModule.createAnnotation({
			latitude : lat,
			longitude : longi,
			image : '/images/hot-icon-azure.png'
		});
		
		hotspotMap.addAnnotation(specifikHotspotMarker);
		
		getHotspotTrails(hotspotId);
		return hotspotMap;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - showHotspot");
	}
}

//-----------------------------------------------------------
// Markerar ut specifika vandringsleder som hör till en hotspot
//-----------------------------------------------------------
function getHotspotTrails(hotId){
	try {
		
		var trailIdList = returnSpecificTrailsByHotspotId(hotId);
		var jsonList = [];
		
		for(var tl = 0; tl < trailIdList.length; tl++){
			var specTrail = returnSpecificTrailById(trailIdList[tl].trailsID);
			
			for(var st = 0; st < specTrail.length; st++){
				jsonList.push(specTrail[st]);
			}
		}
		
		for(var jl = 0; jl < jsonList.length; jl++){
			setSpecificRoute(hotspotMap, jsonList[jl].id, jsonList[jl].name, jsonList[jl].color);
		}
		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - get hotspot trails");
	}
}

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displayAllMarkers() {
	try {
		var hotJson = returnHotspots();
		
		for (var u = 0; u < hotJson.length; u++) {
			var markerHotspot = MapModule.createAnnotation({
				id : hotJson[u].name,
				latitude : hotJson[u].xkoord,
				longitude : hotJson[u].ykoord,
				title : hotJson[u].name,
				subtitle : 'Läs mer om ' + hotJson[u].name + ' här!',
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

		map.addAnnotations(markerHotspotArray);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - displayMarkers");
	}
}

//-----------------------------------------------------------
// Sätter region på kartan
//-----------------------------------------------------------
function setRegion(maptype) {
	try {
		maptype.region = {
			latitude : 58.887396,
			longitude : 11.024908,
			latitudeDelta : 0.08,
			longitudeDelta : 0.08
		};
		maptype.animate = true;
		maptype.userLocation = false;
	} catch (e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - setRegion");
	}

}

//-----------------------------------------------------------
// Visar ikoner för alla informationsobjekt
//-----------------------------------------------------------
function displayInfoSpots(type) {
	try {
		var markerArray = [];
		var infospotJSON = returnSpecificIconsByType(type);

		for (var i = 0; i < infospotJSON.length; i++) {
			var infoMarker = MapModule.createAnnotation({
				latitude : infospotJSON[i].latitude,
				longitude : infospotJSON[i].longitude,
				image : '/images/map_' + infospotJSON[i].name + '.png',
				name : infospotJSON[i].name
			});

			markerArray.push(infoMarker);
			infospotArray.push(infoMarker);
		}

		return markerArray;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - displayInfoSpots");
	}
}

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displaySpecificMarkers(id, maptype) {
	try {
		markerSpecHotspotArray = null;
		markerSpecHotspotArray = [];
			
		var specificHotspots = returnSpecificHotspotsByTrailId(id);

		for (var u = 0; u < specificHotspots.length; u++) {
			var markerSpecificHotspot = MapModule.createAnnotation({
				id : specificHotspots[u].name,
				latitude : specificHotspots[u].xkoord,
				longitude : specificHotspots[u].ykoord,
				title : specificHotspots[u].name,
				subtitle : 'Läs mer om ' + specificHotspots[u].name + ' här!',
				image : '/images/hot-icon-azure.png',
				rightButton : '/images/arrow.png',
				name : 'hotspot'
			});

			markerSpecHotspotArray.push(markerSpecificHotspot);
		}

		maptype.addAnnotations(markerSpecHotspotArray);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - displaySpecMarkers");
	}
}

//-----------------------------------------------------------
// Hämtar ikoner till vald vandringsled
//-----------------------------------------------------------
function getSpecificIconsForTrail(id, maptype) {
	try {
		var specificMarkerArray = [];

		var infospotsTrails = returnIconsByTrailId(id);
		
		for (var i = 0; i < infospotsTrails.length; i++) {
			var specificinfoMarker = MapModule.createAnnotation({
				latitude : infospotsTrails[i].latitude,
				longitude : infospotsTrails[i].longitude,
				image : '/images/map_' + infospotsTrails[i].name + '.png',
				name : 'infospot'
			});

			specificMarkerArray.push(specificinfoMarker);
		}

		maptype.addAnnotations(specificMarkerArray);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - getIcons");
	}
}

//-----------------------------------------------------------
// Tar bort infospots från kartan
//-----------------------------------------------------------
function removeAnnoSpot(anno, infotype) {
	try {
		for (var o = 0; o < infospotArray.length; o++) {
			var type = infospotArray[o].name;
			if (anno == 'info' && infotype == type) {
				map.removeAnnotation(infospotArray[o]);
			}
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - removeAnnoSpot");
	}
}

//-----------------------------------------------------------
// Tar bort hotspots från kartan
//-----------------------------------------------------------
function removeAnnoHotspot() {
	try {
		for (var o = 0; o < markerHotspotArray.length; o++) {
			map.removeAnnotation(markerHotspotArray[o]);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - removeAnnoHotspot");
	}
}

//-----------------------------------------------------------
// Tar bort hotspots från kartan
//-----------------------------------------------------------
function removeSpecHotspot() {
	try {
		for (var o = 0; o < markerSpecHotspotArray.length; o++) {
			detailMap.removeAnnotation(markerSpecHotspotArray[o]);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - removeAnnoHotspot");
	}
}
