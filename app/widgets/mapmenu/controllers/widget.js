
var menuVisible = false;

var infospotsNotVisible = true;
var hotspotsNotVisible = true;

var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();

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
				subtitle : 'Läs mer om ' + jsonObj[i].name + ' här!',
				rightButton : '/pins/androidarrow2.png',
				pincolor : MapModule.ANNOTATION_AZURE,
				name : 'trail'
			});

			baseMap.addAnnotation(markerAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayTrailMarkers");
	}
}

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
				pincolor : MapModule.ANNOTATION_ROSE,
				rightButton : '/pins/androidarrow2.png',
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

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeAnnotations() {
	baseMap.removeAllAnnotations();
	
	$.btnShowWC.backgroundImage = '/images/graywc.png';
	$.btnShowEldplats.backgroundImage = '/images/grayeldplats.png';
	$.btnShowSnorkelled.backgroundImage = '/images/graysnorkelled.png';
	$.btnShowInformation.backgroundImage = '/images/grayinformation.png';
	$.btnShowBadplats.backgroundImage = '/images/graybadplats.png';
	$.btnShowRastplats.backgroundImage = '/images/grayrastplats.png';
	$.btnShowTaltplats.backgroundImage = '/images/graytaltplats.png';
	$.btnShowUtsiktsplats.backgroundImage = '/images/grayutsiktsplats.png';
	$.btnShowTorrdass.backgroundImage = '/images/graytorrdass.png';
}

function normalMap() {
	baseMap.mapType = MapModule.NORMAL_TYPE;
}

function hybridMap() {
	baseMap.mapType = MapModule.HYBRID_TYPE;
}

function satelliteMap() {
	baseMap.mapType = MapModule.SATELLITE_TYPE;
}

function showHotspots() {
	if (hotspotsNotVisible) {
		displayMarkers();
		hotspotsNotVisible = false;
	}
}

function showWC() {
	baseMap.addAnnotations(displayInfoSpots("wc"));
	$.btnShowWC.backgroundImage = '/images/wc.png';
}

function showEldplats() {
	baseMap.addAnnotations(displayInfoSpots("eldplats"));
	$.btnShowEldplats.backgroundImage = '/images/eldplats.png';
}

function showSnorkelled() {
	baseMap.addAnnotations(displayInfoSpots("snorkelled"));
	$.btnShowSnorkelled.backgroundImage = '/images/snorkelled.png';
}

function showInformation() {
	baseMap.addAnnotations(displayInfoSpots("information"));
	$.btnShowInformation.backgroundImage = '/images/information.png';
}

function showBadplats() {
	baseMap.addAnnotations(displayInfoSpots("badplats"));
	$.btnShowBadplats.backgroundImage = '/images/badplats.png';
}

function showRastplats() {
	baseMap.addAnnotations(displayInfoSpots("rastplats"));
	$.btnShowRastplats.backgroundImage = '/images/rastplats.png';
}

function showTaltplats() {
	baseMap.addAnnotations(displayInfoSpots("taltplats"));
	$.btnShowTaltplats.backgroundImage = '/images/taltplats.png';
}

function showUtkiksplats() {
	baseMap.addAnnotations(displayInfoSpots("utsiktsplats"));
	$.btnShowUtsiktsplats.backgroundImage = '/images/utsiktsplats.png';
}

function showTorrdass() {
	baseMap.addAnnotations(displayInfoSpots("torrdass"));
	$.btnShowTorrdass.backgroundImage = '/images/torrdass.png';
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

$.mapmenu.addEventListener('swipe', function() {
	closeMapMenu();
});

Alloy.Globals.showMenuWidget = showMenuWidget;
Alloy.Globals.closeMapManu = closeMapMenu;
