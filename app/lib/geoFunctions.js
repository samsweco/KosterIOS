//-----------------------------------------------------------
// Hämtar användarens position och startar location-event
// för påminnelser om sevärdheter eller bokstavsjakt
//-----------------------------------------------------------
function getUserPos(type) {
	try {
		Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS;
		Titanium.Geolocation.pauseLocationUpdateAutomatically = true;
		Titanium.Geolocation.distanceFilter = 3;

		if (type == 'hotspot') {
			Ti.Geolocation.addEventListener('location', addHotspotLocation);
		}
		if (type == 'letter') {
			Ti.Geolocation.addEventListener('location', addLetterLocation);
		}
		if (type == 'boat') {
			Ti.Geolocation.addEventListener('location', addBoatLocation);
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - get current position GPS");
	}
}
Alloy.Globals.getUserPos = getUserPos;

var addLetterLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'letter');
		currentLocationFinder(interactiveMap);
	}
};

var addHotspotLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'hotspot');
	}
};

var addBoatLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'boat');
	}
};

//-----------------------------------------------------------
// Avbryter location-event
//-----------------------------------------------------------
function stopGPS() {
	Titanium.Geolocation.removeEventListener('location', addHotspotLocation);
}

function stopGame() {
	Titanium.Geolocation.removeEventListener('location', addLetterLocation);
	interactiveGPS = false;
}

function stopBoatGPS() {
	Titanium.Geolocation.removeEventListener('location', addBoatLocation);
}

Alloy.Globals.stopGPS = stopGPS;
Alloy.Globals.stopGame = stopGame;
Alloy.Globals.stopBoatGPS = stopBoatGPS;

//-----------------------------------------------------------
// Hämtar enhetens position och kontrollerar mot punkter
//-----------------------------------------------------------
function setUserPosition(userCoordinates, type) {
	try {
		gLat = userCoordinates.latitude;
		gLon = userCoordinates.longitude;

		if (type == 'hotspot') {
			userIsNearHotspot();
		} else if (type == 'letter') {
			userIsNearLetter();
		} else if (type == 'boat') {
			userOnBoatTrip();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - set userPosition");
	}
}

function currentLocationFinder(type) {
	Titanium.Geolocation.getCurrentPosition(function(e) {
		var currentRegion = {
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			animate : true,
			latitudeDelta : 0.004,
			longitudeDelta : 0.004
		};

		type.setLocation(currentRegion);
	});
}

//-----------------------------------------------------------
// Beräknar avståndet mellan enhetens koordinater och de punkter som håller info
//-----------------------------------------------------------
function distanceM(latt, lonn, GlobalLat, GlobalLon) {
	try {
		if (latt == null || lonn == null || GlobalLat == null || GlobalLon == null) {
			alert("Det finns inga koordinater att titta efter");
		}

		var R = 6371;
		var a = 0.5 - Math.cos((GlobalLat - latt) * Math.PI / 180) / 2 + Math.cos(latt * Math.PI / 180) * Math.cos(GlobalLat * Math.PI / 180) * (1 - Math.cos((GlobalLon - lonn) * Math.PI / 180)) / 2;
		var distanceInM = (R * 2 * Math.asin(Math.sqrt(a))) * 1000;

		return distanceInM;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - distanceInM");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enhetens position är inom radien för en utsatt punkt
//-----------------------------------------------------------
function isInsideRadius(latti, lonni, rad) {
	try {
		var inside = false;
		var distance = distanceM(latti, lonni, gLat, gLon);

		if (distance <= rad) {
			inside = true;
		}
		return inside;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isInsideRadius");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en radie för en sevärdhet,
// sänder ut dialog om true
//-----------------------------------------------------------
function userIsNearHotspot() {
	try {
		var hotspotsToLoop = returnHotspotsToAlert();

		for (var h = 0; h < hotspotsToLoop.length; h++) {
			if (hotspotsToLoop[h].alerted == 0) {
				var hotlat = hotspotsToLoop[h].xkoord;
				var hotlon = hotspotsToLoop[h].ykoord;
				var radius = hotspotsToLoop[h].radie;

				if (isInsideRadius(hotlat, hotlon, radius)) {
					alertOnHotspot(hotspotsToLoop[h].name, hotspotsToLoop[h].infoTxt, hotspotsToLoop[h].id, hotspotsToLoop[h].engelsk_beskrivning, hotspotsToLoop[h].engelsk_titel, hotlat, hotlon);
					setHotspotAlerted(hotspotsToLoop[h].id);
				}
			}
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - nearHotspot");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en radie
// för en sevärdhet, sänder ut dialog om true
//-----------------------------------------------------------
function userOnBoatTrip() {
	try {
		var boatdialog = Ti.UI.createAlertDialog();
		
		if(language == 'svenska'){
			boatdialog.buttonNames = ['Läs mer', 'Stäng'];
		} else {
			boatdialog.buttonNames = ['Read more', 'Close'];
		}

		var boatHotspots = returnBoatHotspots();

		for (var b = 0; b < boatHotspots.length; b++) {
			if (boatHotspots[b].alerted == 0) {

				var blat = boatHotspots[b].xkoord;
				var blon = boatHotspots[b].ykoord;
				var bradius = boatHotspots[b].radie;

				if (isInsideRadius(blat, blon, bradius)) {
					alertOnHotspot(boatHotspots[b].name, boatHotspots[b].infoTxt, boatHotspots[b].id, boatHotspots[b].engelsk_beskrivning, boatHotspots[b].engelsk_titel, blat, blon);
					setHotspotAlerted(boatHotspots[b].id);
					alertedArray.push(boatHotspots[b].name);
					
					if (alertedArray.length == 8) {
						Alloy.Globals.stopBoatGPS();
					}
				}
			}
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - nearBoatspot");
	}
}

function alertOnHotspot(hottitle, infoText, hotid, engtxt, engtitle, x, y) {
	try {
		var dialog = Ti.UI.createAlertDialog();
		
		if(language == 'svenska'){
			dialog.message = 'Nu börjar du närma dig ' + hottitle + '!';
			dialog.buttonNames = ['Läs mer', 'Stäng'];
		} else {
			dialog.message = 'You are approaching ' + hottitle + '!';
			dialog.buttonNames = ['Read more', 'Close'];
		}
		
		dialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				var hotspotTxt = {
					title : hottitle,
					titleEng : engtitle,
					infoTxt : infoText,
					infoTxtEng : engtxt,
					id : hotid,
					x : x,
					y : y,
					fromAlert : true
				};
				
				var hotspotDetails = Alloy.createController("hotspotDetail", hotspotTxt).getView().open();
			}
		});
		
		dialog.show();
		playSound();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - alerthot");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en radie för en bokstav,
// sänder ut dialog om true
//-----------------------------------------------------------
function userIsNearLetter() {
	try {
		var col = fetchUnFoundLettersCol();

		for (var p = 0; p < col.length; p++) {
			if (col[p].alerted == 0 && col[p].found == 0) {

				var lat = col[p].latitude;
				var lon = col[p].longitude;
				var letterradius = col[p].radius;

				if (isInsideRadius(lat, lon, letterradius)) {
					var letterId = col[p].id;
					var letterclue = col[p].clue;
					var engclue = col[p].clue_eng;
					alertLetter(letterclue, letterId, engclue);
					setAlertedOne(letterId);
				}
			}
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", 'isNearPoint - letter');
	}
}

function alertLetter(clue, id, clue_eng) {
	var letterMessage = Ti.UI.createAlertDialog();
	
	if(language == 'svenska'){
		letterMessage.title = 'Du närmar dig bokstav nummer ' + id + '!',
		letterMessage.message = 'Ledtråd: ' + clue;
		letterMessage.buttonNames = ['Gå till bokstavsjakten', 'Stäng'];
	} else {
		letterMessage.title = 'You are approaching letter number ' + id + '!',
		letterMessage.message = 'Clue: ' + clue_eng;
		letterMessage.buttonNames = ['Go to the letter hunt', 'Close'];
	}

	letterMessage.addEventListener('click', function(e) {
		if (e.index == 0) {
			Alloy.CFG.tabs.setActiveTab(3);
		}
	});

	letterMessage.show();
	playSound();
}

//-----------------------------------------------------------
// Spelar upp ett ljud när man får en påminnelse
//-----------------------------------------------------------
function playSound() {
	try {
		var player = Ti.Media.createSound({
			url : "/sound/popcorn.m4a"
		});

		player.play();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", 'geofunctions - playsound');
	}
}

//-----------------------------------------------------------
// Funktioner för att lägga till eller ta bort plupparna på bokstavsjakt-kartan
//-----------------------------------------------------------
function addClueZone() {
	try {
		var zoneJSON = fetchAllLetters();

		for (var c = 0; c < zoneJSON.length; c++) {
			var zoneAnnotation = MapModule.createAnnotation({
				latitude : zoneJSON[c].latitude,
				longitude : zoneJSON[c].longitude,
				image : '/images/' + (c + 1) + 'red.png'
			});

			interactiveMap.addAnnotation(zoneAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - addClueZone");
	}
}

function addSpecificClueZone(id) {
	try {
		if(id < 10){
			var zoneColl = fetchAllLetters();
			var letterZone = zoneColl[id - 1];

			var clueAnnotation = MapModule.createAnnotation({
				latitude : letterZone.latitude,
				longitude : letterZone.longitude
			});

			if (letterZone.found == 0) {
				clueAnnotation.image = '/images/' + id + 'red.png';
			} else {
				clueAnnotation.image = '/images/' + id + 'green.png';
			}
			
			clueZoneArray.push(clueAnnotation);
			interactiveMap.addAnnotation(clueAnnotation); 
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - addClueZone");
	}
}

function removeClueZones(){
	try {
		for (var cl = 0; cl < clueZoneArray.length; cl++) {
			interactiveMap.removeAnnotation(clueZoneArray[cl]);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - addClueZone");
	}
}

//-----------------------------------------------------------
// Sätter rätt region på karta utifrån var användaren befinner sig
//-----------------------------------------------------------
function getPosition(maptype) {
	Ti.Geolocation.getCurrentPosition(function(e) {
		if (e.coords != null) {
			maptype.region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				latitudeDelta : 0.007,
				longitudeDelta : 0.007
			};
			maptype.animate = true;
			maptype.userLocation = true;
		}
	});
}


