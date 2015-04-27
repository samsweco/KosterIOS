var snorkel = true;
var torrdass = true;
var utsiktsplats = true;
var wc = true;
var rastplats = true;
var taltplats = true;
var badplats = true;
var information = true;
var eldplats = true;
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
				centerOffset : {x:0,y:-25},
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

	$.btnShowWC.backgroundImage = '/images/wc.png';
	$.btnShowEldplats.backgroundImage = '/images/eldplats.png';
	$.btnShowSnorkelled.backgroundImage = '/images/snorkelled.png';
	$.btnShowInformation.backgroundImage = '/images/information.png';
	$.btnShowBadplats.backgroundImage = '/images/badplats.png';
	$.btnShowRastplats.backgroundImage = '/images/rastplats.png';
	$.btnShowTaltplats.backgroundImage = '/images/taltplats.png';
	$.btnShowUtsiktsplats.backgroundImage = '/images/utsiktsplats.png';
	$.btnShowTorrdass.backgroundImage = '/images/torrdass.png';
}

function setNoti() {
	
	Ti.API.info('notify : ' + notify);
	
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

function showWC() {
	baseMap.addAnnotations(displayInfoSpots("wc"));
	$.btnShowWC.backgroundImage = '/images/graywc.png';
}

function showEldplats() {
	baseMap.addAnnotations(displayInfoSpots("eldplats"));
	$.btnShowEldplats.backgroundImage = '/images/grayeldplats.png';
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

function closeMapMenu() {
	$.mapmenu.hide();
	menuVisible = false;
}

Alloy.Globals.showMenuWidget = showMenuWidget;
Alloy.Globals.closeMapMenu = closeMapMenu;
