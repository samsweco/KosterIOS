Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

//-----------------------------------------------------------
// Switch för att aktivera location-event för hotspots/sevärdheter
//-----------------------------------------------------------
$.geoSwitch.addEventListener('change', function(e) {
	if ($.geoSwitch.value == true) {
		getUserPos('hotspot');
		hotspotGPS = true;
	}
	if($.geoSwitch.value == false){
		stopGPS();
		hotspotGPS = false;
	}
});

//-----------------------------------------------------------
// Switch för att visa hotspots/sevärdheter på kartan
//-----------------------------------------------------------
$.hotspotSwitch.addEventListener('change', function(e) {
	if ($.hotspotSwitch.value == true) {
		displayAllMarkers(map);
	} else {
		removeAnnoHotspot(map);
	}
});

//-----------------------------------------------------------
// Switch för att visa och släcka användarens position på kartan
//-----------------------------------------------------------
$.posSwitch.addEventListener('change', function(e) {
	if ($.posSwitch.value == true) {
		getPosition(map);
	} else {
		map.userLocation = false;
	}
});

//-----------------------------------------------------------
// Funktioner för att tända och släcka infopunkter på kartan
//-----------------------------------------------------------
function showFarglage() {
	try {
		if (farjelage == false) {
			map.addAnnotations(displayInfoSpots('farjelage'));

			$.btnShowFarjelage.backgroundImage = '/images/farjelage.png';
			farjelage = true;
		} else {
			removeAnnoSpot('info', 'farjelage');
			$.btnShowFarjelage.backgroundImage = '/images/grayfarjelage.png';
			farjelage = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}
}

function showTaltplats() {
	try {
		if (taltplats == false) {
			map.addAnnotations(displayInfoSpots("taltplats"));
			$.btnShowTaltplats.backgroundImage = '/images/taltplats.png';
			taltplats = true;
		} else {
			removeAnnoSpot('info', 'taltplats');
			$.btnShowTaltplats.backgroundImage = '/images/graytaltplats.png';
			taltplats = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}	
}

function showEldplats() {
	try {
		if (eldplats == false) {
			map.addAnnotations(displayInfoSpots("eldplats"));
			$.btnShowEldplats.backgroundImage = '/images/eldplats.png';
			eldplats = true;
		} else {
			removeAnnoSpot('info', 'eldplats');
			$.btnShowEldplats.backgroundImage = '/images/grayeldplats.png';
			eldplats = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}
}

function showSnorkelled() {
	try {
		if (snorkel == false) {
			map.addAnnotations(displayInfoSpots("snorkelled"));
			$.btnShowSnorkelled.backgroundImage = '/images/snorkelled.png';
			snorkel = true;
		} else {
			removeAnnoSpot('info', 'snorkelled');
			$.btnShowSnorkelled.backgroundImage = '/images/graysnorkelled.png';
			snorkel = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}	
}

function showInformation() {
	try {
		if (information == false) {
			map.addAnnotations(displayInfoSpots("information"));
			$.btnShowInformation.backgroundImage = '/images/information.png';
			information = true;
		} else {
			removeAnnoSpot('info', 'information');
			$.btnShowInformation.backgroundImage = '/images/grayinformation.png';
			information = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}
}

function showBadplats() {
	try {
		if (badplats == false) {
			map.addAnnotations(displayInfoSpots("badplats"));
			$.btnShowBadplats.backgroundImage = '/images/badplats.png';
			badplats = true;
		} else {
			removeAnnoSpot('info', 'badplats');
			$.btnShowBadplats.backgroundImage = '/images/graybadplats.png';
			badplats = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}	
}

function showRastplats() {
	try {
		if (rastplats == false) {
			map.addAnnotations(displayInfoSpots("rastplats"));
			$.btnShowRastplats.backgroundImage = '/images/rastplats.png';
			rastplats = true;
		} else {
			removeAnnoSpot('info', 'rastplats');
			$.btnShowRastplats.backgroundImage = '/images/grayrastplats.png';
			rastplats = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}
}

function showUtkiksplats() {
	try {
		if (utsiktsplats == false) {
			map.addAnnotations(displayInfoSpots("utsiktsplats"));
			$.btnShowUtsiktsplats.backgroundImage = '/images/utsiktsplats.png';
			utsiktsplats = true;
		} else {
			removeAnnoSpot('info', 'utsiktsplats');
			$.btnShowUtsiktsplats.backgroundImage = '/images/grayutsiktsplats.png';
			utsiktsplats = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}
}

function showTorrdass() {
	try {
		if (torrdass == false) {
			map.addAnnotations(displayInfoSpots("torrdass"));
			$.btnShowTorrdass.backgroundImage = '/images/torrdass.png';
			torrdass = true;
		} else {
			removeAnnoSpot('info', 'torrdass');
			$.btnShowTorrdass.backgroundImage = '/images/graytorrdass.png';
			torrdass = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}	
}

//-----------------------------------------------------------
// Rensar menyn när man gått ur kartan
//-----------------------------------------------------------
function reloadMapMenu(){
	farjelage = false; 
	snorkel = false;
	torrdass = false;
	utsiktsplats = false;
	rastplats = false;
	taltplats = false;
	badplats = false;
	information = false;
	eldplats = false;
	
	$.btnShowFarjelage.backgroundImage = '/images/grayfarjelage.png';
	$.btnShowTaltplats.backgroundImage = '/images/graytaltplats.png';
	$.btnShowEldplats.backgroundImage = '/images/grayeldplats.png';
	$.btnShowSnorkelled.backgroundImage = '/images/graysnorkelled.png';
	$.btnShowInformation.backgroundImage = '/images/grayinformation.png';
	$.btnShowBadplats.backgroundImage = '/images/graybadplats.png';
	$.btnShowRastplats.backgroundImage = '/images/grayrastplats.png';
	$.btnShowUtsiktsplats.backgroundImage = '/images/grayutsiktsplats.png';
	$.btnShowTorrdass.backgroundImage = '/images/graytorrdass.png';
}
Alloy.Globals.reloadMapMenu = reloadMapMenu;
