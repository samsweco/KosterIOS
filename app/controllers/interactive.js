var args = arguments[0] || {};

showMap();
createMapRoutes();
var familyMap;

//-----------------------------------------------------------
// Öppnar vy och läser in nästa fråga
//-----------------------------------------------------------
function openNextQuestion() {
	try {
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "quizDetail - openQuiz");
	}
}

exports.openNextQuestion = openNextQuestion;

// function saveLetter() {
// 
	// var save = $.letter.value;
	// stor = save.toUpperCase();
	// $.lblSavedLetters.text = '';
// 
	// if (save == "") {
		// alert("Fyll i den bokstav du hittat");
	// }
	// if (save.length > 1) {
		// alert("Du får enbart fylla i en bokstav");
	// } else {
		// lettersArray.push(stor);
		// for (var i = 0; i < lettersArray.length; i++) {
// 
			// $.lblSavedLetters.text += lettersArray[i];
		// }
	// }
// }

//-----------------------------------------------------------
// Hämta nästa ledtråd
//-----------------------------------------------------------
function getClue(id) {

	var clueCollection = Alloy.Collections.gameLetterModel;
	clueCollection.fetch({
		query : 'SELECT infoText from gameLetterModel where id ="' + id + '"'
	});

	var jsonObj = clueCollection.toJSON();
	var txt = jsonObj[0].infoText;

	var clue = {
		infoText : txt
	};

	var returnclue = JSON.stringify(txt);
	return returnclue;
	// $.lblClue.text = txt;
	// id++;
}

//-----------------------------------------------------------
// Visar en alert-box med validering
//-----------------------------------------------------------

//MAN MÅSTE KUNNA KLICKA STÄNG
function showAlert() {
	var dialog;
	$.lblSavedLetters.text = '';

	if (OS_IOS) {
		dialog = Ti.UI.createAlertDialog({
			title : getClue(1),
			style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
			buttonNames : ['OK', 'stäng']
		});

		dialog.addEventListener('click', function(e) {
			if (e.text == "") {
				alert("Fyll i den bokstav du hittat");
				dialog.show();
			}
			if (e.text.length > 1) {
				alert("Du får enbart fylla i en bokstav");
				dialog.show();
			} else {
				lettersArray.push(e.text);
				
				for (var i = 0; i < lettersArray.length; i++) {

					$.lblSavedLetters.text += lettersArray[i];
				}
			}
		});
	}
	if (OS_ANDROID) {
		var textfield = Ti.UI.createTextField();
		dialog = Ti.UI.createAlertDialog({
			title : 'Skriv in din bokstav',
			androidView : textfield,
			buttonNames : ['OK', 'stäng']
		});
	}

	dialog.show();
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	var check = $.word.value;
	check.toLowerCase();

	if (check == word) {
		alert("Bra jobbat!");
	} else {
		alert("Nej du, nu blev det fel...");
	}
}
 //-----------------------------------------
 // Zoomar in kartan på äventyrsleden
 //-----------------------------------------
function showMap() {
	try {
		familyMap = MapModule.createView({
			userLocation : true,
			mapType : MapModule.HYBRID_TYPE,
			animate : true,
			region : {
				latitude : 58.893471,
				longitude : 11.042395,
				latitudeDelta : 0.01,
				longitudeDelta : 0.01
			},
			height : '100%',
			width : Ti.UI.FILL
		});
		$.showFamilyTrail.add(familyMap);

	 } catch(e) {
		 newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - showMap");
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
			//Change multiplier if it's too close
			delta = delta * 1.4;

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
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - calculateMapRegion");
	}

}

//-----------------------------------------------------------
// skapar vandringsleden och sätter den på kartan
//-----------------------------------------------------------
function createMapRoutes() {
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
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - createMapRoute");
	}
}


