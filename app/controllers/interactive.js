Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};

var wrongWord = 0;
var correctLetters = "A, T, R, Ö, N, N, E, M, O";

displayMap();

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
			color : 'black',
			font : {
				fontSize : '16dp',
				fontStyle : 'italic',
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				fontFamily : 'Raleway-Medium'
			}
		});

		var clueTxt = Ti.UI.createLabel({
			top : '15dp',
			text : letterJSON[i].clue,
			color : 'black',
			font : {
				fontSize : 12,
				fontStyle : 'italic',
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				fontFamily : 'Raleway-Medium'
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
}

// function showCorrectLetters() {
// $.lblCorrectLetters.show();
// $.lblCorrectLetters.height = '40dp';
// $.lblCorrectLetters.text = correctLetters;
// $.btnShowCorrect.hide();
// $.btnShowCorrect.height = 0;
// }

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

// $.nextClue.addEventListener('click', function(e) {
// toNextClue(foundLetterId);
// });

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

//-----------------------------------------------------------
// Validerar bokstaven som skrivits in, sätter found till
// 1 i letterModel och läser upp nästa ledtråd
//-----------------------------------------------------------
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
				setLetterOne(foundLetterId, letterToCheck);
				foundLetterId++;
				setLabelText();
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
	}

	if (foundLetterId > 9) {
		$.clueSlideView.height = 0;
		$.sendOneLetter.height = 0;
		$.sendOneLetter.hide();
		$.sendWord.show();
		$.sendWord.height = '40dp';
		$.txtLetter.value = '';
		$.lblnextClue.hide();
		$.lblnextClue.height = 0;
		$.nextClue.hide();
		$.nextClue.height = 0;
	}
	//}
}

//-----------------------------------------------------------
// Kontrollerar om man fått ihop alla bokstäver. Om man hittat
// alla bokstäver göms och släcks rätt labels och textfields
//-----------------------------------------------------------
// function allLetters() {
// // try {
// if (foundLetterId > 9) {
// $.txtLetter.hide();
// $.txtLetter.height = 0;
//
// $.lblLetters.hide();
// $.lblLetters.height = 0;
//
// $.horizontalView.hide();
// $.horizontalView.height = 0;
//
// $.viewNext.hide();
// $.viewNext.height = 0;
//
// $.lblnextClue.hide();
// $.lblnextClue.height = 0;
//
// $.nextClue.hide();
// $.nextClue.height = 0;
//
// $.btnStartQuiz.height = 0;
//
// $.wordView.show();
// $.wordView.height = Ti.UI.SIZE;
//
// $.txtWord.show();
// $.txtWord.height = '40dp';
//
// $.lblWord.show();
// $.lblWord.height = '40dp';
//
// $.lblWelcome.text = 'Skriv ordet du bildat av bokstäverna!';
// $.lblInfoText.text = 'Ledtråd: En svävande geléklump i havet.';
//
// $.btnShowCorrect.show();
// $.btnShowCorrect.height = '40dp';
// }
// // } catch(e) {
// // newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
// // }
// }

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
