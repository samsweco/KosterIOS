var snorkel = false;
var torrdass = false;
var utsiktsplats = false;
var wc = false;
var rastplats = false;
var taltplats = false;
var badplats = false;
var information = false;
var eldplats = false;
var menuVisible = false;

var infospotsNotVisible = true;
var hotspotsNotVisible = true;

//var MapModule = require('ti.map');
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
				image : '/images/pin-' + jsonObj[i].color + '.png',
				centerOffset : {
					x : 0,
					y : -25
				},
				rightButton : '/images/arrow.png',
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

			if (OS_IOS) {
				var marker = MapModule.createAnnotation({
					id : markersJSON[u].name,
					latitude : markersJSON[u].xkoord,
					longitude : markersJSON[u].ykoord,
					title : markersJSON[u].name,
					subtitle : 'Läs mer om ' + markersJSON[u].name + ' här!',
					image : '/images/hot-icon-azure.png',
					// pincolor : MapModule.ANNOTATION_PURPLE,
					rightButton : '/images/arrow.png',
					name : 'hotspot'
				});
			}

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

	$.btnShowBadplats.backgroundImage = '/images/badplats.png';
	$.btnShowRastplats.backgroundImage = '/images/rastplats.png';
	$.btnShowTaltplats.backgroundImage = '/images/taltplats.png';
	$.btnShowUtsiktsplats.backgroundImage = '/images/utsiktsplats.png';
	$.btnShowTorrdass.backgroundImage = '/images/torrdass.png';
}

function setNoti() {
	if (notify) {
		$.btnSetNotification.text = 'Aktivera notifikationer';
		$.btnSetNotification.color = 'gray';
		notify = false;
	} else {
		$.btnSetNotification.text = 'Inaktivera notifikationer';
		$.btnSetNotification.color = '#00a9f0';
		notify = true;
	}
}

function showHotspots() {
	if (hotspotsNotVisible) {
		displayMarkers();
		hotspotsNotVisible = false;
	}
}

$.geoSwitch.addEventListener('change', function(e) {
	if($.geoSwitch.value == true){
		$.lblSetGPS.text = "GPS-funktioner aktiverade";
		Alloy.Globals.getGPSpos();
	}else{
		$.lblSetGPS.text = "GPS-funktioner avaktiverade";
	}
	
});

function removeInfoSpot(infotype) {
	var arrayInfo = displayInfoSpots(infotype);

	for (var o = 0; o < arrayInfo.length; o++) {
		// Ti.API.info('arrayTitle : ' + JSON.stringify(arrayInfo[info].title));
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
	if (snorkel == false) {
		baseMap.addAnnotations(displayInfoSpots("snorkelled"));
		$.btnShowSnorkelled.backgroundImage = '/images/graysnorkelled.png';
		snorkel = true;
	} else {
		removeInfoSpot("snorkelled");
		$.btnShowSnorkelled.backgroundImage = '/images/snorkelled.png';
		snorkel = false;
	}
}

function showInformation() {
	if (information == false) {
		baseMap.addAnnotations(displayInfoSpots("information"));
		$.btnShowInformation.backgroundImage = '/images/grayinformation.png';
		information = true;
	} else {
		removeInfoSpot("information");
		$.btnShowInformation.backgroundImage = '/images/information.png';
		information = false;
	}
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

function closeMapMenu() {
	$.mapmenu.hide();
	menuVisible = false;
}

Alloy.Globals.showMenuWidget = showMenuWidget;
Alloy.Globals.closeMapMenu = closeMapMenu;
