Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

// var menuVisible = false;
// var hotspotsNotVisible = true;
// var trailsCollection = getTrailsCollection();
// var hotspotCollection = getHotspotCollection();
// 
// var infospotArray = [];
var menuVisible = false;
var mapMenuVisible = false;

$.geoSwitch.addEventListener('change', function(e) {
	if ($.geoSwitch.value == true) {
		alert('På!');
		getUserPos('hotspot');
	}
	
	if($.geoSwitch.value == false){
		stopGPS();
		alert('Av!');
	}
});

$.hotspotSwitch.addEventListener('change', function(e) {
	if ($.hotspotSwitch.value == true) {
		displayAllMarkers(map);
		hotspotsNotVisible = false;
	} else {
		removeAnnoHotspot(map);
		hotspotsNotVisible = true;
	}
});

function showFarglage() {

	if (farjelage == false) {
		map.addAnnotations(displayInfoSpots('farjelage'));

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
		map.addAnnotations(displayInfoSpots("taltplats"));
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
		map.addAnnotations(displayInfoSpots("eldplats"));
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
		map.addAnnotations(displayInfoSpots("snorkelled"));
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
		map.addAnnotations(displayInfoSpots("information"));
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
		map.addAnnotations(displayInfoSpots("badplats"));
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
		map.addAnnotations(displayInfoSpots("rastplats"));
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
		map.addAnnotations(displayInfoSpots("utsiktsplats"));
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
		map.addAnnotations(displayInfoSpots("torrdass"));
		$.btnShowTorrdass.backgroundImage = '/images/torrdass.png';
		torrdass = true;
	} else {
		removeAnnoSpot('info', 'Torrdass');
		$.btnShowTorrdass.backgroundImage = '/images/graytorrdass.png';
		torrdass = false;
	}
}

function showMenuWidget() {
	if (menuVisible == false) {
		$.mapmenu.show();
		menuVisible = true;
	} else {
		$.mapmenu.hide();
		menuVisible = false;
	}
}

function showMapMenuWidget() {
	if (mapMenuVisible == false) {
		$.mapmenu.show();
		mapMenuVisible = true;
	} else {
		$.mapmenu.hide();
		mapMenuVisible = false;
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
Alloy.Globals.showMapMenuWidget = showMapMenuWidget;
Alloy.Globals.closeMapMenu = closeMapMenu;

