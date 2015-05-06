var args = arguments[0] || {};
var radius = 20;
var nextId = 1;

var letterCollection = getLetterCollection();
letterCollection.fetch();
var jsonCollection = letterCollection.toJSON();
Alloy.Globals.jsonCollection = jsonCollection;

var hotspotCollection = getHotspotCollection();

showMap();
createMapRoute();
var familyMap;
displayMarkers();
addClueZone();
//getGPSpos();

function startInteractive() {
	$.btnStartQuiz.hide();
	$.btnStartQuiz.height = 0;
	$.txtLetter.show();
	$.lblLetters.show();
	$.lblCollectedLetters.show();
	getGPSpos('interactive');
	loadClue(1);
}

function loadClue(id) {
	$.lblWelcome.text = "Ledtråd: ";
	$.lblInfoText.text = jsonCollection[id - 1].clue;
}

function addClueZone() {

	for (var c = 0; c < Alloy.Globals.jsonCollection.length; c++) {
		var markerAnnotation = MapModule.createAnnotation({
			latitude : Alloy.Globals.jsonCollection[c].latitude,
			longitude : Alloy.Globals.jsonCollection[c].longitude,
			title : Alloy.Globals.jsonCollection[c].id,
			subtitle : Alloy.Globals.jsonCollection[c].letter
		});

		if (Alloy.Globals.jsonCollection[c].found == 0) {
			markerAnnotation.image = '/images/red.png';
		} else {
			markerAnnotation.image = '/images/green.png';
		}

		familyMap.addAnnotation(markerAnnotation);
	}
}

function sendLetter() {
	checkLetter(getLetter());
	familyMap.removeAllAnnotations();
	addClueZone();
	allLetters();
}

function getLetter() {
	var letter = $.txtLetter.value;
	return letter.toUpperCase();
	//};
}

function nextClue(){
	var nextClue = Alloy.Globals.jsonCollection[nextId].clue;
	$.lblInfoText.text = nextClue;
}

//Sätta alert title

function checkLetter(letterToCheck) {

	if (Alloy.Globals.jsonCollection[foundId - 1].letter == letterToCheck) {
		lettersArray.push(Alloy.Globals.jsonCollection[foundId - 1].letter);
		Alloy.Globals.jsonCollection[foundId - 1].found = 1;

		$.lblCollectedLetters.text = $.lblCollectedLetters.text + letterToCheck;
		$.txtLetter.value = '';
		loadClue(Alloy.Globals.jsonCollection[foundId-1].id);
		nextId++;
		nextClue();

	} else {
		alert("Är du säker på att " + letterToCheck + " är rätt bokstav?");
		$.txtLetter.value = '';
	}
}

function allLetters() {

	if (word.length == lettersArray.length) {
		$.txtLetter.hide();
		$.txtLetter.height = 0;
		$.lblLetters.hide();
		$.lblLetters.height = 0;
		$.btnStartQuiz.height = 0;
		$.wordView.show();

	}
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	var check = $.txtWord.value;
	//	check.toLowerCase();

	if (check == word) {
		alert("Bra jobbat Det rätta ordet är SAM!");
	} else {
		alert("Försök igen! Du har snart klurat ut det!");
	}
}

//MAP STUFF
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displayMarkers() {
	try {
		var markerHotArray = [];
		var hotspots = getHotspots();
		
		for (var u = 0; u < hotspots.length; u++) {

				var markerHot = MapModule.createAnnotation({
					id : hotspots[u].name,
					latitude : hotspots[u].xkoord,
					longitude : hotspots[u].ykoord,
					title : hotspots[u].name,
					subtitle : 'Läs mer om ' + hotspots[u].name + ' här!',
					image : '/images/hot-icon-azure.png',
					rightButton : '/images/arrow.png',
					name : 'hotspot'
				});

			markerHotArray.push(markerHot);
		}

		familyMap.addAnnotations(markerHotArray);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayMarkers");
	}
}

function getHotspots() {
	var hotstrailCollection = Alloy.Collections.hotspotModel;
	hotstrailCollection.fetch({
		query : 'SELECT hotspotModel.name, hotspotModel.xkoord, hotspotModel.ykoord from hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID ="' + 7 + '"'
	});

	var jsonObj = hotstrailCollection.toJSON();
	return jsonObj;
}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspot(myId) {
	try {
		hotspotCollection.fetch({
			query : 'SELECT id, infoTxt FROM hotspotModel where name = "' + myId + '"'
		});

		var jsonObjHot = hotspotCollection.toJSON();

		var hotspotTxt = {
			title : myId,
			infoTxt : jsonObjHot[0].infoTxt,
			id : jsonObjHot[0].id
		};

		var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		Alloy.CFG.tabs.activeTab.open(hotspotDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - showHotspot");
	}
}

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
familyMap.addEventListener('click', function(evt) {
	if (evt.clicksource == 'rightButton') {
		showHotspot(evt.annotation.id);
	}
});

//-----------------------------------------
// Zoomar in kartan på äventyrsleden
//-----------------------------------------
function showMap() {
	try {
		familyMap = MapModule.createView({
			userLocation : true,
			mapType : MapModule.HYBRID_TYPE,
			animate : true,
			height : '100%',
			width : Ti.UI.FILL
		});
		$.showFamilyTrail.add(familyMap);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - showMap");
	}
}

//-----------------------------------------------------------
// Beräknar nivån av inzoomning på en vald led
//-----------------------------------------------------------
function calculateMapRegion(trailCoordinates) {
	try {
		if (trailCoordinates.length != 0) {
			var poiCenter = {};
			var delta = 0.02;
			var minLat = trailCoordinates[0].latitude,
			    maxLat = trailCoordinates[0].latitude,
			    minLon = trailCoordinates[0].longitude,
			    maxLon = trailCoordinates[0].longitude;
			for (var i = 0; i < trailCoordinates.length - 1; i++) {
				minLat = Math.min(trailCoordinates[i + 1].latitude, minLat);
				maxLat = Math.max(trailCoordinates[i + 1].latitude, maxLat);
				minLon = Math.min(trailCoordinates[i + 1].longitude, minLon);
				maxLon = Math.max(trailCoordinates[i + 1].longitude, maxLon);
			}

			var deltaLat = maxLat - minLat;
			var deltaLon = maxLon - minLon;

			delta = Math.max(deltaLat, deltaLon);
			// Ändra om det ska vara mer zoomat
			delta = delta * 1.5;

			poiCenter.lat = maxLat - parseFloat((maxLat - minLat) / 2);
			poiCenter.lon = maxLon - parseFloat((maxLon - minLon) / 2);

			region = {
				latitude : poiCenter.lat,
				longitude : poiCenter.lon,
				latitudeDelta : delta,
				longitudeDelta : delta

			};
		}
		return region;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - calculateMapRegion");
	}

}

//-----------------------------------------------------------
// skapar vandringsleden och sätter den på kartan
//-----------------------------------------------------------
function createMapRoute() {
	try {
		var zoomedRoute = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "/routes/adventureroute.json").read().text;
		var parsedRoute = JSON.parse(zoomedRoute);

		var geoArray = [];
		geoArray.push(parsedRoute);

		var coordArray = [];

		for (var u = 0; u < geoArray.length; u++) {
			var coords = geoArray[0].features[0].geometry.paths[u];

			for (var i = 0; i < coords.length; i++) {

				var point = {
					latitude : coords[i][1],
					longitude : coords[i][0]
				};
				coordArray.push(point);
			}

			var route = {
				name : 'Äventyrsleden',
				points : coordArray,
				color : 'purple',
				width : 2.0
			};

			familyMap.addRoute(MapModule.createRoute(route));
		}

		familyMap.region = calculateMapRegion(coordArray);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - createMapRoute");
	}
}

//GEO STUFF
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

function getGPSpos() {
	try {

		Ti.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
				Ti.API.info('Get current position' + e.error);
				getGPSpos();
			}
		});

		if (Ti.Geolocation.locationServicesEnabled) {
			Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
			Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS;
			Titanium.Geolocation.pauseLocationUpdateAutomatically = true;
			Titanium.Geolocation.distanceFilter = 3;

			Ti.Geolocation.addEventListener('location', function(e) {
				if (e.error) {
					Ti.API.info('Kan inte sätta eventListener ' + e.error);
				} else {
					getPosition(e.coords);
					//		$.coords.text = 'Lat: ' + JSON.stringify(e.coords.latitude + 'Lon: ' + JSON.stringify(e.coords.longitude));

				}
			});

		} else {
			alert('Tillåt gpsen, tack');
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - get current position GPS");
	}

}

//-----------------------------------------------------------
// Hämtar enhetens position och kontrollerar mot punkter
//-----------------------------------------------------------
function getPosition(coordinatesObj) {
	try {
		gLat = coordinatesObj.latitude;
		gLon = coordinatesObj.longitude;

		isNearPoint();

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - getPosition");
	}
}

//-----------------------------------------------------------
// Beräknar avståndet mellan enhetens koordinater och de punkter som håller info
//-----------------------------------------------------------
function distanceInM(lat1, lon1, GLat, GLon) {
	try {
		if (lat1 == null || lon1 == null || GLat == null || GLat == null) {
			alert("Det finns inga koordinater att titta efter");
		}

		var R = 6371;
		var a = 0.5 - Math.cos((GLat - lat1) * Math.PI / 180) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(GLat * Math.PI / 180) * (1 - Math.cos((GLon - lon1) * Math.PI / 180)) / 2;
		var distance = (R * 2 * Math.asin(Math.sqrt(a))) * 1000;

		return distance;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - distanceInM");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enhetens position är inom radien för en utsatt punkt
//-----------------------------------------------------------
function isInsideRadius(lat1, lon1, rad) {
	try {

		var isInside = false;
		var distance = distanceInM(lat1, lon1, gLat, gLon);

		if (distance <= rad) {
			isInside = true;
		}
		return isInside;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - isInsideRadius");
	}
}

//-----------------------------------------------------------
// Sätter ut punkterna som ska kontrolleras, loopar
//-----------------------------------------------------------
function isNearPoint() {
	try {
		for (var i = 0; i < Alloy.Globals.jsonCollection.length; i++) {

			if (Alloy.Globals.jsonCollection[i].found == 0) {

				var lat = Alloy.Globals.jsonCollection[i].latitude;
				var lon = Alloy.Globals.jsonCollection[i].longitude;
				foundId = Alloy.Globals.jsonCollection[i].id;
				//$.lblInfoText.text = Alloy.Globals.jsonCollection[i].clue;

				if (isInsideRadius(lat, lon, radius) && Alloy.Globals.jsonCollection[i].alerted == 0) {

					var message = Ti.UI.createAlertDialog({
						message : Alloy.Globals.jsonCollection[i].clue,
						title : 'Ny bokstav i närheten!'
					});
					message.show();
					Alloy.Globals.jsonCollection[i].alerted = 1;
				}

			}
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - isNearPoint");
	}
}