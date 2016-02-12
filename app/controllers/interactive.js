Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};

displayMap();
checkIfStarted();
setInteractiveViews();

//-----------------------------------------------------------
// Sätter label med rätt font som windowtitle
//-----------------------------------------------------------
var windowTitle = Ti.UI.createLabel({
	text: String.format(L('interactive_row'), ''),
	font: {
		fontSize: '17dp',
		fontFamily: 'Raleway-Medium'
	}
});
$.interactiveWindow.titleControl = windowTitle;

//-----------------------------------------------------------
// Visar kartan med de olika sevärdheterna och ledtrådsplupparna
//-----------------------------------------------------------
function displayMap() {
	try {
		$.showFamilyTrail.add(showDetailMap(interactiveMap, 7, 'Äventyrsslingan', 'purple'));
		addClueZone();
		displaySpecificMarkers(7, interactiveMap);
		getSpecificIconsForTrail(7, interactiveMap);
		interactiveMap.addEventListener('click', function(evt) {
			if (evt.clicksource == 'rightButton') {
				showHotspot(evt.annotation.id);
			}
		});
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspot(name) {
	try {
		var jsonObjHot = returnSpecificHotspotsByName(name);

		var hotspotTxt = {
			title : name,
			infoTxt : jsonObjHot[0].infoTxt,
			id : jsonObjHot[0].id,
			x : jsonObjHot[0].xkoord,
			y : jsonObjHot[0].ykoord
		};

		var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		$.interNav.openWindow(hotspotDetail);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Interactiv - showHotspot");
	}
}

//-----------------------------------------------------------
// Kontrollerar antalet funna bokstäver när det inte går att skrolla mer
//-----------------------------------------------------------
$.slides.addEventListener('scrollend', function(e) {
	try {
		removeClueZones();

		var clueIndex = ($.slides.getCurrentPage() + 1);
		addSpecificClueZone(clueIndex);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
});

//-----------------------------------------------------------
// Fyller scrollviewn med ledtrådar
//-----------------------------------------------------------
function setInteractiveViews() {
	try {
		var letterJSON = fetchAllLetters();

		for (var i = 0; i < letterJSON.length; i++) {
			var letter_view = Ti.UI.createView({
				height : '100%',
				width : '85%',
				top : '0dp',
				layout : 'vertical'
			});

			var clueTitle = Ti.UI.createLabel({
				top : '10dp',
				left : '0dp',
				text : 'Ledtråd ' + (i + 1),
				color : '#FCAF17',
				font : {
					fontSize : '16dp',
					fontFamily : 'Raleway-Medium'
				}
			});

			var clueTxt = Ti.UI.createLabel({
				top : '5dp',
				left : '0dp',
				text : letterJSON[i].clue,
				color : 'black',
				font : {
					fontSize : '14dp',
					fontFamily : 'Raleway-Light'
				}
			});

			var backgroundView = Ti.UI.createView({
				layout : 'vertical',
				backgroundColor : 'white',
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL
			});

			letter_view.add(clueTitle);
			letter_view.add(clueTxt);

			backgroundView.add(letter_view);

			$.slides.pagingControlColor = '#fed077';
			$.slides.addView(backgroundView);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

//-----------------------------------------------------------
// Startar bokstavsjakten, gömmer och visar rätt labels
//-----------------------------------------------------------
function startInteractive() {
	try {
		if (!Ti.Geolocation.locationServicesEnabled) {
			var alertDialog = Ti.UI.createAlertDialog({
				title : 'Påminnelser',
				message : 'Tillåt appen att se din position för att kunna få påminnelser när du närmar dig en bokstav! Gå in på platstjänster i dina inställningar.',
				buttonNames : ['OK']
			});
			alertDialog.show();
		}

		setView();
		getUserPos('letter');
		interactiveGPS = true;

		interactiveMap.removeAllAnnotations();
		addSpecificClueZone(1);
		displaySpecificMarkers(7, interactiveMap);
		getSpecificIconsForTrail(7, interactiveMap);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

//-----------------------------------------------------------
// Gömmer och visar rätt vyer när man startar
//-----------------------------------------------------------
function setView() {
	try {
	setLabelText();
	$.lblScroll.show();
	$.lblScroll.heigh = Ti.UI.SIZE;
	$.clueSlideView.height = '25%';
	$.clueSlideView.show();
	$.lettersView.height = Ti.UI.SIZE;
	$.lettersView.show();
	$.hideView.hide();
	$.hideView.height = 0;
	} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}

}

//-----------------------------------------------------------
// Kontrollerar om man redan startat bokstavsjakten och sätter
// scrollview'n till rätt ledtråd utifrån hur många bokstäver
// man redan hittat
//-----------------------------------------------------------
function checkIfStarted() {
	try {
	var started = fetchFoundLettersCol();
	var next_id = started.length;

	if (next_id > 0 && next_id < 9) {
		setView();
		foundLetterId = next_id + 1;
		$.slides.currentPage = foundLetterId - 1;

		interactiveMap.removeAllAnnotations();
		displaySpecificMarkers(7, interactiveMap);
		getSpecificIconsForTrail(7, interactiveMap);
		addSpecificClueZone(foundLetterId);
	} else if (started.length == 9) {
		setLabelText();
		setLastView();
	}
	} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}

}

//-----------------------------------------------------------
// Gämmer och visar rätt element när alla bokstäver är inne
//-----------------------------------------------------------
function setLastView() {
	$.hideView.hide();
	$.hideView.height = 0;
	$.clueSlideView.hide();
	$.clueSlideView.height = 0;

	$.lettersView.show();
	$.lettersView.height = Ti.UI.SIZE;

	// Göm "skriv in bokstavs"-element
	$.sendOneLetter.hide();
	$.sendOneLetter.height = 0;
	$.nextClue.hide();
	$.nextClue.height = 0;
	$.lblScroll.hide();
	$.lblScroll.heigh = 0;

	// Visa "skriv in ord"-element
	$.wordClue.show();
	$.wordClue.height = Ti.UI.SIZE;
	$.wordClueLbl.show();
	$.wordClueLbl.height = Ti.UI.SIZE;
	$.sendWord.show();
	$.sendWord.height = '30dp';
	$.lblCollectedLetters.show();
	$.lblCollectedLetters.height = Ti.UI.SIZE;
}

//-----------------------------------------------------------
// Hämtar rätt bokstav och visar nästa ledtråd
//-----------------------------------------------------------
function toNextClue() {
	try {
		var nextDialog = Ti.UI.createAlertDialog({
			message : 'Visa försvunnen bokstav?',
			buttonNames : ['Ja, visa!', 'Stäng']
		});

		nextDialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				var lost = fetchOneLetter(foundLetterId);

				if (lost != null) {
					lostLetter = lost[0].letter;
					lostId = lost[0].id;

					$.txtLetter.value = '';
					$.txtLetter.value = lostLetter;
				} else {
					var errorDialog = Ti.UI.createAlertDialog({
						message : 'Du har redan hittat alla bokstäver. Starta om appen och testa igen!',
						buttonNames : ['Stäng']
					});
				}

			}
		});

		nextDialog.show();

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

//-----------------------------------------------------------
// Efter bokstaven validerats läses den upp bland de andra
// bokstäverna i en label
//-----------------------------------------------------------
function sendLetter() {
	try {
		var letter = $.txtLetter.value;
		var toSend = letter.toUpperCase();
		checkLetter(toSend);
		$.txtLetter.value = '';
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

//-----------------------------------------------------------
// Kontrollerar att man skrivit in rätt bokstav
//-----------------------------------------------------------
function checkLetter(letterToCheck) {
	try {
	var messageDialog = Ti.UI.createAlertDialog();
	var fetchLetter = fetchOneLetter(foundLetterId);
	var correctLetter = fetchLetter[0].letter;

	if (letterToCheck.length > 1) {
		messageDialog.message = "Man får bara skriva in en bokstav.";
		messageDialog.title = 'Ojdå, nu blev det fel';
		messageDialog.buttonNames = ['OK'];

		messageDialog.show();
	} else if (letterToCheck.length < 1 && letterToCheck.length == " ") {
		messageDialog.message = "Man måste skriva in en bokstav.";
		messageDialog.title = 'Ojdå, nu blev det fel';
		messageDialog.buttonNames = ['OK'];

		messageDialog.show();
	} else if (letterToCheck != correctLetter) {
		messageDialog.message = "Är du säker på att " + letterToCheck + ' var rätt bokstav för ledtråd ' + foundLetterId + '? Kontrollera att du inte gått förbi en bokstav.';
		messageDialog.title = 'Kontrollera bokstav';
		messageDialog.buttonNames = ['OK'];

		messageDialog.show();
	} else {
		var unFound = fetchUnFoundLettersCol();

		if (unFound.length > 0) {
			setLetterOne(unFound[0].id);
			foundLetterId++;
			setLabelText();

			removeClueZones();
			$.slides.currentPage = unFound[0].id;
			addSpecificClueZone(foundLetterId);
		}
	}
	} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

//-----------------------------------------------------------
// Adderar bokstaven till labeln med de funna bokstäverna
//-----------------------------------------------------------
function setLabelText() {
	try {
	var found = fetchFoundLettersCol();
	$.lblCollectedLetters.text = String.format(L('foundLetters_lbl'), '');

	for (var i = 0; i < found.length; i++) {
		$.lblCollectedLetters.text += found[i].letter;

		if (found[i].id == 9) {
			$.wordClue.show();
			$.wordClue.height = Ti.UI.SIZE;
			$.wordClueLbl.show();
			$.wordClueLbl.height = Ti.UI.SIZE;
			$.sendWord.show();
			$.sendWord.height = '40dp';
			$.txtLetter.value = '';

			$.clueSlideView.height = 0;
			$.sendOneLetter.height = 0;
			$.sendOneLetter.hide();
			$.nextClue.hide();
			$.nextClue.height = 0;
			$.lblScroll.hide();
			$.lblScroll.height = 0;
		}
	}
	} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	try {
		var check = $.txtLetter.value;
		var bigword = check.toUpperCase();
		var checkword = bigword.split(" ", 1);

		var alertDialog = Ti.UI.createAlertDialog({
			buttonNames : ['Stäng'],
			title : "Fel ord"
		});

		if (checkword == word) {
			removeClueZones();

			$.sendWord.hide();
			$.sendWord.height = 0;
			$.txtLetter.hide();
			$.txtLetter.height = 0;
			$.wordClue.hide();
			$.wordClue.height = 0;
			$.wordClueLbl.hide();
			$.wordClueLbl.height = 0;

			$.lblCollectedLetters.text = 'Bra jobbat! Du hittade det rätta ordet!';
			$.lblCollectedLetters.fontFamily = 'Raleway-Medium';
			$.lblCollectedLetters.fontSize = '16dp';

			Alloy.Globals.stopGame();
			startOver();
		} else {
			alertDialog.message = "Försök igen! Du har snart klurat ut det!";
			alertDialog.show();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

//-----------------------------------------------------------
// Avslutar bokstavsjakten när användaren stänger av appen
//-----------------------------------------------------------
Titanium.App.addEventListener('onclose', function() {
	Alloy.Globals.stopGame();
	startOver();
});

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

// //-----------------------------------------------------------
// // Funktion för att stänga och rensa sida när man stänger sidan
// //
// // SKA VI HA DETTA? STÄNGER AV JAKTEN ISF JU??
// //-----------------------------------------------------------
// var cleanup = function() {
// $.destroy();
// $.off();
// $.interactiveWin = null;
// };
//
// $.interactiveWin.addEventListener('close', cleanup);
