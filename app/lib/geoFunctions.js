//-----------------------------------------------------------
// Hämtar hotspotCollection
//-----------------------------------------------------------
var hotspotsModel = Alloy.Models.hotspotModel;

function returnHotspotsToAlert() {
	var hotspotColl = Alloy.Collections.hotspotModel;
	hotspotColl.fetch({
		query : 'SELECT * FROM hotspotModel WHERE alerted = 0'
	});

	return hotspotColl.toJSON();
}

function setHotspotAlerted(id) {
	hotspotsModel.fetch({
		'id' : id
	});

	hotspotsModel.set({
		'alerted' : 1
	});
	hotspotsModel.save();
}

function returnBoatHotspots() {
	var hotspotColl = Alloy.Collections.hotspotModel;
	hotspotColl.fetch({
		query : 'SELECT * FROM hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID = 8'
	});

	return hotspotColl.toJSON();
}

//-----------------------------------------------------------
// Hämtar letterCollection och letterModel
//-----------------------------------------------------------
var lettersModel = Alloy.Models.letterModel;

function setNoLetter(lid) {
	lettersModel.fetch({
		'id' : lid
	});

	lettersModel.set({
		'letter' : '-',
		'found' : 1
	});

	lettersModel.save();
	alerted = false;
	// foundLetterId++;

}

function setLetterOne(letterId, letter) {
	lettersModel.fetch({
		'id' : letterId
	});

	lettersModel.set({
		'letter' : letter,
		'found' : 1
	});
	lettersModel.save();
//	alerted = false;
	//	lettersModel.destroy();
}

function setLetterZero(letterId) {
	lettersModel.fetch({
		'id' : letterId
	});

	lettersModel.set({
		'letter' : null,
		'found' : 0
	});
	lettersModel.save();
	
	Ti.API.info('setZero :: ' + JSON.stringify(lettersModel));
}

function getLength() {
	return fetchFoundLettersCol().length;
}

function setAlertedOne(letterId) {
	lettersModel.fetch({
		'id' : letterId
	});

	lettersModel.set({
		'alerted' : 1
	});
	lettersModel.save();
}

function fetchAllLetters() {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch();
	return letterCollection.toJSON();
}

function fetchFoundLettersCol() {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch({
		query : 'SELECT * FROM letterModel WHERE found = 1'
	});
	return letterCollection.toJSON();
}

function fetchUnFoundLettersCol() {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch({
		query : 'SELECT * FROM letterModel WHERE found = 0'
	});
	return letterCollection.toJSON();
}

function fetchOneLetter(lId) {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch({
		query : 'SELECT * FROM letterModel WHERE id =' + lId + '"'
	});
	return letterCollection.toJSON();
}

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
	startOver();
	lettersModel.destroy();
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
			latitudeDelta : 0.002,
			longitudeDelta : 0.002
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
					alertOnHotspot(hotspotsToLoop[h].name, hotspotsToLoop[h].infoTxt, hotspotsToLoop[h].id);
					setHotspotAlerted(hotspotsToLoop[h].id);
				}
			}

		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - nearHotspot");
	}
}

//-----------------------------------------------------------
// På båtturen : kontrollerar om enheten är innanför en radie
// för en sevärdhet, sänder ut dialog om true
//-----------------------------------------------------------
function userOnBoatTrip() {
	try {
		var boatdialog = Ti.UI.createAlertDialog({
			buttonNames : ['Läs mer', 'Stäng']
		});

		var boatHotspots = returnBoatHotspots();

		for (var b = 0; b < boatHotspots.length; b++) {
			if (boatHotspots[b].alerted == 0) {

				var blat = boatHotspots[b].xkoord;
				var blon = boatHotspots[b].ykoord;
				var bradius = boatHotspots[b].radie;

				if (isInsideRadius(blat, blon, bradius)) {
					alertOnHotspot(boatHotspots[b].name, boatHotspots[b].infoTxt, boatHotspots[b].id);
					boatHotspots[b].alerted = 1;

					alertedArray.push(boatTripHotspots[b].name);
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

function alertOnHotspot(hottitle, infoText, hotid) {
	try {
		var dialog = Ti.UI.createAlertDialog({
			message : 'Nu börjar du närma dig ' + hottitle + '!',
			buttonNames : ['Läs mer', 'Stäng']
		});

		dialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				var hotspotTxt = {
					title : hottitle,
					infoTxt : infoText,
					id : hotid
				};

				var hotspotDetails = Alloy.createController("hotspotDetail", hotspotTxt).getView();
				Alloy.CFG.tabs.activeTab.open(hotspotDetails);
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

					if (letterId == foundLetterId) {
						alertLetter(letterclue);
						setAlertedOne(letterId);
					} else {
						// checkIfRight(letterId);
						if (!alerted) {

							var letteralert = Ti.UI.createAlertDialog({
								title : 'Har du missat en bokstav?',
								message : 'Du kanske har missat en bokstav? Gå tillbaka eller tryck ifatt ledtrådarna till rätt nummer.',
								buttonNames : ['Gå tillbaka och hitta förra', 'Stäng']
							});
							
							letteralert.addEventListener('click', function(evt){
								if(evt.index == 1){
									alertLetter(letterclue);
									setAlertedOne(letterId);
								}
							});

							letteralert.show();
							// col[p].alerted == 1;
							alerted = true;
						}
					}
				}
			}
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", 'isNearPoint - letter');
	}
}

//-----------------------------------------------------------
// Kontrollerar om användaren har missat någon bokstav
//-----------------------------------------------------------
function checkIfRight(lId) {
	try {
		letId = lId;
		var dif = (lId - foundLetterId);

		for (var i = 0; i < dif; i++) {
			setNoLetter(lId);
			lId++;
		}

		Alloy.Globals.loadClue(foundLetterId + dif);
		alertLetter(lId.clue);
		setAlertedOne(lId);
		//	var clue = fetchOneLetter(lId);
		// alertLetter(clue[0].clue);
		playSound();

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", 'geofunctions - wrong');
	}
}

function alertLetter(clue) {
	var message = Ti.UI.createAlertDialog({
		title : 'Ny bokstav i närheten!',
		buttonNames : ['Gå till bokstavsjakten', 'Stäng']
	});

	message.message = clue;
	message.addEventListener('click', function(e) {
		if (e.index == 0) {
			Alloy.CFG.tabs.setActiveTab(3);
		}
	});
	message.show();
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
// Lägger till de gröna plupparna på bokstavsjakt-kartan
//-----------------------------------------------------------
function addClueZone() {
	try {
		var zoneJSON = fetchAllLetters();

		for (var c = 0; c < zoneJSON.length; c++) {
			var zoneAnnotation = MapModule.createAnnotation({
				latitude : zoneJSON[c].latitude,
				longitude : zoneJSON[c].longitude,
				image : '/images/' + (c + 1) + 'green.png'
			});

			interactiveMap.addAnnotation(zoneAnnotation);
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

//-----------------------------------------------------------
// Sparar till found 0 och tömmer bokstäverna så man kan spela igen
//-----------------------------------------------------------
function startOver() {
	var col = fetchFoundLettersCol();
	try {
		for (var i = 0; i < col.length; i++) {;
			setLetterZero(col[i].id);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - startOver");
	}
}

//Alloy.Globals.startOver = startOver;
