Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};

var wrongWord = 0;
var correctLetters = "A, T, R, Ö, N, N, E, M, O";

displayMap();
checkIfStarted();

//-----------------------------------------------------------
// Visar kartan med de olika sevärdheterna och ledtrådsplupparna
//-----------------------------------------------------------
function displayMap() {
	// try {
	$.showFamilyTrail.add(showDetailMap(interactiveMap, 7, 'Äventyrsleden', 'purple'));
	addClueZone();
	displaySpecificMarkers(7, interactiveMap);
	interactiveMap.addEventListener('click', function(evt) {
		if (evt.clicksource == 'rightButton') {
			showHotspot(evt.annotation.id);
		}
	});
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	// }
}

setInteractiveViews();
function setInteractiveViews() {
	// try {
	var letterJSON = fetchAllLetters();

	for (var i = 0; i < letterJSON.length; i++) {
		var letter_view = Ti.UI.createView({
			height : '100%',
			width : Ti.UI.FILL,
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
				fontSize : 14,
				fontStyle : 'italic',
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

		$.slides.pagingControlColor = '#FCAF17';
		//$.slides.pagingControlColor = 'white';
		//Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN; // .ScrollIndicatorStyle.WHITE;
		$.slides.addView(backgroundView);
	}
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "Interactive - widget");
	// }
}

//-----------------------------------------------------------
// Startar bokstavsjakten, gömmer och visar rätt labels
//-----------------------------------------------------------
function startInteractive() {
	// try {
	if (!Ti.Geolocation.locationServicesEnabled) {
		var alertDialog = Ti.UI.createAlertDialog({
			title : 'Påminnelser',
			message : 'Tillåt gpsen för att kunna få påminnelser när du närmar dig en bokstav!',
			buttonNames : ['OK']
		});
		alertDialog.show();

		setView();
	} else {
		setView();
	}

	getUserPos('letter');
	interactiveGPS = true;
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	// }
}

function setView() {
	setLabelText();
	$.clueSlideView.height = '25%';
	$.clueSlideView.show();
	$.lettersView.height = Ti.UI.SIZE;
	$.lettersView.show();
	$.hideView.hide();
	$.hideView.height = 0;
	$.btnShowCorrect.hide();
	$.btnShowCorrect.height = 0;
}

function checkIfStarted() {
	var started = fetchFoundLettersCol();
	if (started.length > 0) {
		setView();
	}
}

function showCorrectLetters() {
	$.lblCorrectLetters.show();
	$.lblCorrectLetters.height = '40dp';
	$.lblCorrectLetters.text = correctLetters;
	$.btnShowCorrect.hide();
	$.btnShowCorrect.height = 0;
}

function toNextClue() {
	// try {
	var nextDialog = Ti.UI.createAlertDialog({
		title : 'Visa försvunnen bokstav?',
		buttonNames : ['Ja, visa!', 'Stäng']
	});

	nextDialog.show();

	nextDialog.addEventListener('click', function(e) {
		if (e.index == 0) {
			var lost = fetchUnFoundLettersCol();
			lostLetter = lost[0].letter;
			lostId = lost[0].id;

			$.txtLetter.value = '';
			$.txtLetter.value = lostLetter;
		}
	});

	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	// }
}

// $.slides.addEventListener('scroll', function(e) {
// nr = $.slides.currentPage;
// Ti.API.info(nr);
// interactiveMap.removeAllAnnotations();
// addOneZone(nr);
// });
//
// function addOneZone(nr) {
// try {
// var zoneJSON = fetchAllLetters();
//
// var zoneAnnotation = MapModule.createAnnotation({
// latitude : zoneJSON[nr].latitude,
// longitude : zoneJSON[nr].longitude,
// image : '/images/' + (nr + 1) + 'green.png'
// });
//
// interactiveMap.addAnnotation(zoneAnnotation);
// //	}
// } catch(e) {
// newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - addClueZone");
// }
// }

//-----------------------------------------------------------
// Efter bokstaven validerats läses den upp bland de andra
// bokstäverna i en label
//-----------------------------------------------------------
function sendLetter() {
	// try {
	var letter = $.txtLetter.value;
	var toSend = letter.toUpperCase();
	checkLetter(toSend);
	$.txtLetter.value = '';
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	// }
}

function checkLetter(letterToCheck) {
	// try {
	var messageDialog = Ti.UI.createAlertDialog();

	if (letterToCheck.length > 1) {
		messageDialog.message = "Man får bara skriva in en bokstav.";
		messageDialog.title = 'Ojdå, nu blev det fel';
		messageDialog.buttonNames = ['Stäng'];

		messageDialog.show();
	} else if (letterToCheck.length < 1 && letterToCheck.length == " ") {
		messageDialog.message = "Man måste skriva in en bokstav.";
		messageDialog.title = 'Ojdå, nu blev det fel';
		messageDialog.buttonNames = ['Stäng'];

		messageDialog.show();
	} else {
		messageDialog.message = "Vill du spara bokstaven " + letterToCheck + "?";
		messageDialog.title = 'Bra, du hittade en bokstav!';
		messageDialog.buttonNames = ['Ja, jag vill spara!', 'Stäng'];

		messageDialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				//				$.txtLetter.value = '';
				var unFound = fetchUnFoundLettersCol();
				if (unFound.length > 0) {
					setLetterOne(unFound[0].id, letterToCheck);
					foundLetterId++;
					setLabelText();
				}
			}
		});

		messageDialog.show();
	}
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	// }
}

function setLabelText() {
	var found = fetchFoundLettersCol();
	$.lblCollectedLetters.text = 'Bokstäver: ';

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
			$.btnShowCorrect.show();
			$.btnShowCorrect.height = '30dp';

			$.clueSlideView.height = 0;
			$.sendOneLetter.height = 0;
			$.sendOneLetter.hide();
			$.lblnextClue.hide();
			$.lblnextClue.height = 0;
			$.nextClue.hide();
			$.nextClue.height = 0;
		}
	}

}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	// try {
	var check = $.txtLetter.value;
	var checkword = check.toUpperCase();
	var alertDialog = Ti.UI.createAlertDialog({
		buttonNames : ['Stäng'],
		title : "Fel ord"
	});

	if (checkword == word) {
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
		interactiveGPS = false;
	} else {
		alertDialog.message = "Försök igen! Du har snart klurat ut det!";
		alertDialog.show();
	}
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	// }
}

Titanium.App.addEventListener('close', function() {
	Alloy.Globals.stopGame();
});

var cleanup = function() {
	$.destroy();
	$.off();
	$.interactiveWin = null;
};

$.interactiveWin.addEventListener('close', cleanup);
