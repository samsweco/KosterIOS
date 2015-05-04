var menuVisible = false;
var hotspotsNotVisible = true;
var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();

var addedToMap = {};

$.geoSwitch.value = true;

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displayMarkers() {
	try {
		var markerArray = [];
		hotspotCollection.fetch();
		
		// if(Alloy.CFG.tabs.activeTab == 'hikeTab'){
// 			
		// } else {
			// hotspotCollection.fetch();
		// }
		
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
// Hämtar data för hotspots som hör till den valda vandringsleden
//-----------------------------------------------------------
// function getHotspotData() {
	// try {
		// var id = trailId;
// 
		// var hotstrailCollection = Alloy.Collections.hotspotModel;
		// hotstrailCollection.fetch({
			// query : 'SELECT hotspotModel.name, hotspotModel.cover_pic from hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID ="' + id + '"'
		// });
// 
		// var jsonObj = hotstrailCollection.toJSON();
		// return jsonObj;
// 
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "trailDetail - getHotspotData");
	// }
// }



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
			var marker = MapModule.createAnnotation({
				latitude : infospotJSON[i].latitude,
				longitude : infospotJSON[i].longitude,
				image : '/images/map_' + infospotJSON[i].name + '.png'
			});

			if (infospotJSON[i].name == 'taltplats') {
				marker.title = 'Tältplats';
			} else if (infospotJSON[i].name == 'farglage') {
				marker.title = 'Färgläge';
			} else {
				marker.title = capitalizeFirstLetter(infospotJSON[i].name);
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

function removeAnnoSpot(anno, infotype) {
	// var arrayAnno = [];
	// var anno;
// 
	// if (annoType == 'info') {
		// anno = displayInfoSpots(infotype);
	// } else if (annoType == 'hotspot') {
		// anno = displayMarkers();
	// }
// 	
	addedToMap[infotype] = anno;
	
	var annoArray = addedToMap[infotype];
	Ti.API.info('addedToMap : ' + JSON.stringify(annoArray));
	
	for (var o = 0; o < annoArray.length; o++) {
		baseMap.removeAnnotation(annoArray[o].title);
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

		// Alloy.Globals.getGPSpos('hotspot');
	} else {
		removeAnnoSpot('hotspot', 'hot');
		hotspotsNotVisible = true;
	}
});

function showFarglage() {	
	var annos = displayInfoSpots('farglage');
	addedToMap['farglage'] = annos;
	
	if (farglage == false) {
		baseMap.addAnnotations(annos);
		
		$.btnShowFarglage.backgroundImage = '/images/farglage.png';
		farglage = true;
	} else {
		removeAnnoSpot(annos, 'farglage');
		$.btnShowFarglage.backgroundImage = '/images/grayfarglage.png';
		farglage = false;
	}
}

function showEldplats() {
	if (eldplats == false) {
		baseMap.addAnnotations(displayInfoSpots("eldplats"));
		$.btnShowEldplats.backgroundImage = '/images/eldplats.png';
		eldplats = true;
	} else {
		removeAnnoSpot('info', 'eldplats');
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
		removeAnnoSpot('info', 'snorkelled');
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
		removeAnnoSpot('info', 'information');
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
		removeAnnoSpot('info', 'badplats');
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
		removeAnnoSpot('info', 'rastplats');
		$.btnShowRastplats.backgroundImage = '/images/grayrastplats.png';
		rastplats = false;
	}
}

function showTaltplats() {
	if (taltplats == false) {
		baseMap.addAnnotations(displayInfoSpots("taltplats"));
		$.btnShowTaltplats.backgroundImage = '/images/taltplats.png';
		taltplats = true;
	} else {
		removeAnnoSpot('info', 'taltplats');
		$.btnShowTaltplats.backgroundImage = '/images/graytaltplats.png';
		taltplats = false;
	}
}

function showUtkiksplats() {
	if (utsiktsplats == false) {
		baseMap.addAnnotations(displayInfoSpots("utsiktsplats"));
		$.btnShowUtsiktsplats.backgroundImage = '/images/utsiktsplats.png';
		utsiktsplats = true;
	} else {
		removeAnnoSpot('info', 'utsiktsplats');
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
		removeAnnoSpot('info', 'torrdass');
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
