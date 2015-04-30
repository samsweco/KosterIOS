var menuVisible = false;

var infospotsNotVisible = true;
var hotspotsNotVisible = true;

var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();

//-----------------------------------------------------------
// Visar markers för vandringslederna
//-----------------------------------------------------------
// function displayTrailMarkers() {
	// try {
		// trailsCollection.fetch({
			// query : 'SELECT name, pinLon, pinLat, color FROM trailsModel'
		// });
// 
		// var jsonObj = trailsCollection.toJSON();
		// for (var i = 0; i < jsonObj.length; i++) {
			// var markerAnnotation = MapModule.createAnnotation({
				// id : jsonObj[i].name,
				// latitude : jsonObj[i].pinLat,
				// longitude : jsonObj[i].pinLon,
				// title : jsonObj[i].name,
				// subtitle : 'Läs mer om ' + jsonObj[i].name + ' här!',
				// rightButton : '/images/arrow.png',
				// image : '/images/pin-' + jsonObj[i].color + '.png',
				// name : 'trail'
			// });
// 
			// baseMap.addAnnotation(markerAnnotation);
		// }
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayTrailMarkers");
	// }
// }

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displayMarkers() {
	try {
		var markerArray = [];
		hotspotCollection.fetch();

		var markersJSON = hotspotCollection.toJSON();
		for (var u = 0; u < markersJSON.length; u++) {

			var marker = MapModule.createAnnotation({
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

			markerArray.push(marker);
		}

		baseMap.addAnnotations(markerArray);
		hotspotsNotVisible = false;

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
			query : 'SELECT latitude, longitude FROM infospotCoordinatesModel WHERE name ="' + type + '"'
		});
		
		var infospotJSON = infospotCollection.toJSON();
		
		for (var u = 0; u < infospotJSON.length; u++) {
			var marker = MapModule.createAnnotation({
				latitude : infospotJSON[u].latitude,
				longitude : infospotJSON[u].longitude,
				image : '/images/map_' + type + '.png'
			});

			if (type == 'taltplats') {
				marker.title = 'Tältplats';
			} else {
				marker.title = capitalizeFirstLetter(type);
			}

			markerArray.push(marker);
		}

		return markerArray;
		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayInfoSpots");
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeAnnotations() {
	baseMap.removeAllAnnotations();
	
	$.btnShowEldplats.backgroundImage = '/images/eldplats.png';
	$.btnShowSnorkelled.backgroundImage = '/images/snorkelled.png';
	$.btnShowInformation.backgroundImage = '/images/information.png';
	$.btnShowBadplats.backgroundImage = '/images/badplats.png';
	$.btnShowRastplats.backgroundImage = '/images/rastplats.png';
	$.btnShowTaltplats.backgroundImage = '/images/taltplats.png';
	$.btnShowUtsiktsplats.backgroundImage = '/images/utsiktsplats.png';
	$.btnShowTorrdass.backgroundImage = '/images/torrdass.png';
}

function showHotspots() {
	if (hotspotsNotVisible) {
		displayMarkers();
		hotspotsNotVisible = false;
	}
}

function removeInfoSpot(infotype) {
	var arrayInfo = displayInfoSpots(infotype);

	for (var o = 0; o < arrayInfo.length; o++) {
		Ti.API.info('arrayTitle : ' + JSON.stringify(arrayInfo[o].title));
		baseMap.removeAnnotation(arrayInfo[o].title);
	}
}

function showEldplats() {
	if (eldplats == false) {
		baseMap.addAnnotations(displayInfoSpots("eldplats"));
		$.btnShowEldplats.backgroundImage = '/images/grayeldplats.png';
		eldplats = true;
	} else {
		removeInfoSpot("eldplats");
		$.btnShowEldplats.backgroundImage = '/images/eldplats.png';
		eldplats = false;
	}
}

function showSnorkelled() {
	baseMap.addAnnotations(displayInfoSpots("snorkelled"));
	$.btnShowSnorkelled.backgroundImage = '/images/graysnorkelled.png';
}

function showInformation() {
	baseMap.addAnnotations(displayInfoSpots("information"));
	$.btnShowInformation.backgroundImage = '/images/grayinformation.png';
}

function showBadplats() {
	baseMap.addAnnotations(displayInfoSpots("badplats"));
	$.btnShowBadplats.backgroundImage = '/images/graybadplats.png';
}

function showRastplats() {
	baseMap.addAnnotations(displayInfoSpots("rastplats"));
	$.btnShowRastplats.backgroundImage = '/images/grayrastplats.png';
}

function showTaltplats() {
	baseMap.addAnnotations(displayInfoSpots("taltplats"));
	$.btnShowTaltplats.backgroundImage = '/images/graytaltplats.png';
}

function showUtkiksplats() {
	baseMap.addAnnotations(displayInfoSpots("utsiktsplats"));
	$.btnShowUtsiktsplats.backgroundImage = '/images/grayutsiktsplats.png';
}

function showTorrdass() {
	baseMap.addAnnotations(displayInfoSpots("torrdass"));
	$.btnShowTorrdass.backgroundImage = '/images/graytorrdass.png';
}

function showMenuWidget() {
	if (!menuVisible) {
		$.mapmenu.show();
		menuVisible = true;
	} else {
		$.mapmenu.hide();
		menuVisible = false;
	}
}

function closeMapMenu(){
		$.mapmenu.hide();
		menuVisible = false;
}

$.mapmenu.addEventListener('singleTap', function() {
	closeMapMenu();
});

Alloy.Globals.showMenuWidget = showMenuWidget;
Alloy.Globals.closeMapMenu = closeMapMenu;
