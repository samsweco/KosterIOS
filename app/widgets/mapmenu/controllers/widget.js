var menuVisible = false;

var infospotsNotVisible = true;
var hotspotsNotVisible = true;

var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();

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

		return markerArray;
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

function removeAnnoSpot(annoType, infotype) {
	var arrayAnno = [];

	if (annoType == 'info') {
		arrayAnno = displayInfoSpots(infotype);
	} else if (annoType == 'hotspot') {
		arrayAnno = displayMarkers();
	}

	for (var o = 0; o < arrayAnno.length; o++) {
		Ti.API.info('arrayTitle : ' + JSON.stringify(arrayAnno[o].title));
		baseMap.removeAnnotation(arrayAnno[o].title);
	}
}

function showHotspots() {
	var arrayHot = displayMarkers();

	if (hotspotsNotVisible) {
		baseMap.addAnnotations(arrayHot);
		hotspotsNotVisible = false;
	} else {
		removeAnnoSpot('hotspot', 'hot');
		hotspotsNotVisible = true;
	}
}

function showEldplats() {
	if (eldplats == false) {
		baseMap.addAnnotations(displayInfoSpots("eldplats"));
		$.btnShowEldplats.backgroundImage = '/images/grayeldplats.png';
		eldplats = true;
	} else {
		removeAnnoSpot('info', 'eldplats');
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
		removeAnnoSpot('info', 'snorkelled');
		$.btnShowSnorkelled.backgroundImage = '/images/snorkelled.png';
		snorkel = false;
	}
}

function showInformation() {
	if(information == false){
		baseMap.addAnnotations(displayInfoSpots("information"));
		$.btnShowInformation.backgroundImage = '/images/grayinformation.png';
		information = true;
	}else{
		removeAnnoSpot('info', 'information');
		$.btnShowInformation.backgroundImage = '/images/information.png';
		information = false;
	}
}

function showBadplats() {
	if(badplats == false){
		baseMap.addAnnotations(displayInfoSpots("badplats"));
		$.btnShowBadplats.backgroundImage = '/images/graybadplats.png';
		badplats = true;
	}else{
		removeAnnoSpot('info', 'badplats');
		$.btnShowBadplats.backgroundImage = '/images/badplats.png';
		badplats = false;
	}	
}

function showRastplats() {
	if(rastplats == false){
		baseMap.addAnnotations(displayInfoSpots("rastplats"));
		$.btnShowRastplats.backgroundImage = '/images/grayrastplats.png';
		rastplats = true;
	}else{
		removeAnnoSpot('info', 'rastplats');
		$.btnShowRastplats.backgroundImage = '/images/rastplats.png';
		rastplats = false;
	}
}

function showTaltplats() {
	if(taltplats == false){
		baseMap.addAnnotations(displayInfoSpots("taltplats"));
		$.btnShowTaltplats.backgroundImage = '/images/graytaltplats.png';
		taltplats = true;
	}else{
		removeAnnoSpot('info', 'taltplats');
		$.btnShowTaltplats.backgroundImage = '/images/taltplats.png';
		taltplats = false;
	}
}

function showUtkiksplats() {
	if(utsiktsplats == false){
		baseMap.addAnnotations(displayInfoSpots("utsiktsplats"));
		$.btnShowUtsiktsplats.backgroundImage = '/images/grayutsiktsplats.png';
		utsiktsplats = true;
	}else{
		removeAnnoSpot('info', 'utsiktsplats');
		$.btnShowUtsiktsplats.backgroundImage = '/images/utsiktsplats.png';
		utsiktsplats = false;
	}	
}

function showTorrdass() {
	if(torrdass == false){
		baseMap.addAnnotations(displayInfoSpots("torrdass"));
		$.btnShowTorrdass.backgroundImage = '/images/graytorrdass.png'; 
		torrdass = true;
	}else{
		removeAnnoSpot('info', 'torrdass');
		$.btnShowTorrdass.backgroundImage = '/images/torrdass.png';
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
