Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};

var wrongWord = 0;
var correctLetters = "A, T, R, Ö, N, N, E, M, O";

displayMap();
checkIfStarted();

//-----------------------------------------------------------
// Visar kartan med de olika sevärdheterna och ledtrådsplupparna
//-----------------------------------------------------------
function displayMap() {
	try {
		$.showFamilyTrail.add(showDetailMap(interactiveMap, 7, 'Äventyrsleden', 'purple'));
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

$.slides.addEventListener('scrollend', function(e) {
	try {
		interactiveMap.removeAllAnnotations();

		var clueIndex = ($.slides.getCurrentPage() + 1);
		addSpecificClueZone(clueIndex);
		displaySpecificMarkers(7, interactiveMap);
		getSpecificIconsForTrail(7, interactiveMap);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
});

setInteractiveViews();

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
				top : '15dp',
				text : 'Ledtråd ' + (i + 1),
				color : '#FCAF17',
				font : {
					fontSize : '16dp',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					fontFamily : 'Raleway-Medium'
				}
			});

			var clueTxt = Ti.UI.createLabel({
				top : '15dp',
				text : letterJSON[i].clue,
				color : 'black',
				font : {
					fontSize : '14dp',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					fontFamily : 'Raleway-Light'
				}
			});

			var backgroundView = Ti.UI.createView({
				layout : 'vertical',
				backgroundColor : 'white',
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE
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
				message : 'Tillåt gpsen för att kunna få påminnelser när du närmar dig en bokstav!',
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
		$.btnShowCorrect.hide();
		$.btnShowCorrect.height = 0;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}

}

function checkIfStarted() {
	try {
		var started = fetchFoundLettersCol();
		var next_id = started.length;
		if (next_id > 0 && next_id < 9) {
			setView();
			foundLetterId = next_id + 1;
			$.slides.currentPage = foundLetterId;
			addSpecificClueZone(foundLetterId);
		} else if (started.length == 9) {
			setLabelText();
			setLastView();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}

}

function setLastView() {
	$.hideView.hide();
	$.hideView.height = 0;
	$.clueSlideView.hide();
	$.clueSlideView.height = 0;
	$.lettersView.show();
	$.lettersView.height = Ti.UI.SIZE;
	$.sendOneLetter.hide();
	$.sendOneLetter.height = 0;
	$.lblnextClue.hide();
	$.lblnextClue.height = 0;
	$.nextClue.hide();
	$.nextClue.height = 0;
	$.wordClue.show();
	$.wordClue.height = Ti.UI.SIZE;
	$.wordClueLbl.show();
	$.wordClueLbl.height = Ti.UI.SIZE;
	$.sendWord.show();
	$.sendWord.height = '30dp';
	$.lblCollectedLetters.show();
	$.lblCollectedLetters.height = Ti.UI.SIZE;
}

function showCorrectLetters() {
	try {
		$.lblCorrectLetters.show();
		$.lblCorrectLetters.height = '40dp';
		$.lblCorrectLetters.text = correctLetters;
		$.btnShowCorrect.hide();
		$.btnShowCorrect.height = 0;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

function toNextClue() {
	try {
		var nextDialog = Ti.UI.createAlertDialog({
			message : 'Visa försvunnen bokstav?',
			buttonNames : ['Ja, visa!', 'Stäng']
		});

		nextDialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				var lost = fetchOneLetter(foundLetterId);
				lostLetter = lost[0].letter;
				lostId = lost[0].id;

				$.txtLetter.value = '';
				$.txtLetter.value = lostLetter;
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

function checkLetter(letterToCheck) {
	try {
		var messageDialog = Ti.UI.createAlertDialog();
		var correctLetter = fetchOneLetter(foundLetterId);
		
		Ti.API.info('CorrectLetter: ' + JSON.stringify(correctLetter) + ' och foundId: ' + foundLetterId);

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
			// messageDialog.message = "Vill du spara bokstaven " + letterToCheck + "?";
			// messageDialog.title = 'Bra, du hittade en bokstav!';
			// messageDialog.buttonNames = ['Ja, jag vill spara!', 'Stäng'];
			//
			// messageDialog.addEventListener('click', function(e) {
			// if (e.index == 0) {
			//
			// }
			// });
			//
			// messageDialog.show();

			var unFound = fetchUnFoundLettersCol();

			if (unFound.length > 0) {
				setLetterOne(unFound[0].id, letterToCheck);
				foundLetterId++;
				setLabelText();

				interactiveMap.removeAllAnnotations();
				displaySpecificMarkers(7, interactiveMap);
				getSpecificIconsForTrail(7, interactiveMap);
				$.slides.currentPage = unFound[0].id;
				addSpecificClueZone(foundLetterId);
			}
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

function setLabelText() {
	try {

		Ti.API.info('sätter lblText');
		var found = fetchFoundLettersCol();
		Ti.API.info(JSON.stringify(found));
		$.lblCollectedLetters.text = 'Bokstäver: ';

		for (var i = 0; i < found.length; i++) {
			Ti.API.info(found[i].f_l);
			$.lblCollectedLetters.text += found[i].f_l;

			if (found[i].id == 9) {
				$.wordClue.show();
				$.wordClue.height = Ti.UI.SIZE;
				$.wordClueLbl.show();
				$.wordClueLbl.height = Ti.UI.SIZE;
				$.sendWord.show();
				$.sendWord.height = '40dp';
				$.txtLetter.value = '';
				$.btnShowCorrect.show();
				$.btnShowCorrect.height = '30dp';

				$.clueSlideView.height = 0;
				$.sendOneLetter.height = 0;
				$.sendOneLetter.hide();
				$.lblnextClue.hide();
				$.lblnextClue.height = 0;
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
			interactiveMap.removeAllAnnotations();
			displaySpecificMarkers(7, interactiveMap);
			getSpecificIconsForTrail(7, interactiveMap);

			$.sendWord.hide();
			$.sendWord.height = 0;
			$.txtLetter.hide();
			$.txtLetter.height = 0;
			$.wordClue.hide();
			$.wordClue.height = 0;
			$.wordClueLbl.hide();
			$.wordClueLbl.height = 0;
			$.btnShowCorrect.hide();
			$.btnShowCorrect.height = 0;
			$.lblCorrectLetters.hide();
			$.lblCorrectLetters.height = 0;

			$.lblCollectedLetters.text = 'Bra jobbat! Du hittade det rätta ordet!';
			$.lblCollectedLetters.fontFamily = 'Raleway-Medium';
			$.lblCollectedLetters.fontSize = '16dp';

			Alloy.Globals.stopGame();
			startOver();
			//interactiveGPS = false;
		} else {
			alertDialog.message = "Försök igen! Du har snart klurat ut det!";
			alertDialog.show();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

Titanium.App.addEventListener('close', function() {
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

var cleanup = function() {
	$.destroy();
	$.off();
	$.interactiveWin = null;
};

$.interactiveWin.addEventListener('close', cleanup);
