var menuVisible = false;
var hotspotsNotVisible = true;
var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();

var addedToMap = {};
var infospotArray = [];

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displayMarkers() {
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
		if(anno == 'info' && infotype == type){
			baseMap.removeAnnotation(infospotArray[o]);
		}
	}
}

function removeAnnoHotspot() {
	var anno = displayMarkers();
	for (var o = 0; o < anno.length; o++) {
		baseMap.removeAnnotation(anno[o].title);
	}
}

$.geoSwitch.addEventListener('change', function(e) {
	if ($.geoSwitch.value == true) {
		Alloy.Globals.getGPSpos('hotspot');
	}
});

$.hotspotSwitch.addEventListener('change', function(e) {
	if ($.hotspotSwitch.value == true) {
		var arrayHot = displayMarkers();
		baseMap.addAnnotations(arrayHot);
		hotspotsNotVisible = false;

	} else {
		removeAnnoHotspot();
		hotspotsNotVisible = true;
	}
});

function showFarglage() {

	if (farjelage == false) {
		baseMap.addAnnotations(displayInfoSpots('farjelage'));

		$.btnShowFarjelage.backgroundImage = '/images/farjelage.png';
		farjelage = true;
	} else {
		removeAnnoSpot('info', 'Färjeläge');
		$.btnShowFarjelage.backgroundImage = '/images/grayfarjelage.png';
		farjelage = false;
	}
}

function showTaltplats() {
	if (taltplats == false) {
		baseMap.addAnnotations(displayInfoSpots("taltplats"));
		$.btnShowTaltplats.backgroundImage = '/images/taltplats.png';
		taltplats = true;
	} else {
		removeAnnoSpot('info', 'Tältplats');
		$.btnShowTaltplats.backgroundImage = '/images/graytaltplats.png';
		taltplats = false;
	}
}

function showEldplats() {
	if (eldplats == false) {
		baseMap.addAnnotations(displayInfoSpots("eldplats"));
		$.btnShowEldplats.backgroundImage = '/images/eldplats.png';
		eldplats = true;
	} else {
		removeAnnoSpot('info', 'Eldplats');
		$.btnShowEldplats.backgroundImage = '/images/grayeldplats.png';
		eldplats = false;
	}
}

function showSnorkelled() {
	if (snorkel == false) {
		baseMap.addAnnotations(displayInfoSpots("snorkelled"));
		$.btnShowSnorkelled.backgroundImage = '/images/snorkelled.png';
		snorkel = true;
	} else {
		removeAnnoSpot('info', 'Snorkelled');
		$.btnShowSnorkelled.backgroundImage = '/images/graysnorkelled.png';
		snorkel = false;
	}
}

function showInformation() {
	if (information == false) {
		baseMap.addAnnotations(displayInfoSpots("information"));
		$.btnShowInformation.backgroundImage = '/images/information.png';
		information = true;
	} else {
		removeAnnoSpot('info', 'Information');
		$.btnShowInformation.backgroundImage = '/images/grayinformation.png';
		information = false;
	}
}

function showBadplats() {
	if (badplats == false) {
		baseMap.addAnnotations(displayInfoSpots("badplats"));
		$.btnShowBadplats.backgroundImage = '/images/badplats.png';
		badplats = true;
	} else {
		removeAnnoSpot('info', 'Badplats');
		$.btnShowBadplats.backgroundImage = '/images/graybadplats.png';
		badplats = false;
	}
}

function showRastplats() {
	if (rastplats == false) {
		baseMap.addAnnotations(displayInfoSpots("rastplats"));
		$.btnShowRastplats.backgroundImage = '/images/rastplats.png';
		rastplats = true;
	} else {
		removeAnnoSpot('info', 'Rastplats');
		$.btnShowRastplats.backgroundImage = '/images/grayrastplats.png';
		rastplats = false;
	}
}

function showUtkiksplats() {
	if (utsiktsplats == false) {
		baseMap.addAnnotations(displayInfoSpots("utsiktsplats"));
		$.btnShowUtsiktsplats.backgroundImage = '/images/utsiktsplats.png';
		utsiktsplats = true;
	} else {
		removeAnnoSpot('info', 'Utsiktsplats');
		$.btnShowUtsiktsplats.backgroundImage = '/images/grayutsiktsplats.png';
		utsiktsplats = false;
	}
}

function showTorrdass() {
	if (torrdass == false) {
		baseMap.addAnnotations(displayInfoSpots("torrdass"));
		$.btnShowTorrdass.backgroundImage = '/images/torrdass.png';
		torrdass = true;
	} else {
		removeAnnoSpot('info', 'Torrdass');
		$.btnShowTorrdass.backgroundImage = '/images/graytorrdass.png';
		torrdass = false;
	}
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

function closeMapMenu() {
	$.mapmenu.hide();
	menuVisible = false;
}

$.mapmenu.addEventListener('singleTap', function() {
	closeMapMenu();
});

Alloy.Globals.showMenuWidget = showMenuWidget;
Alloy.Globals.closeMapMenu = closeMapMenu;
