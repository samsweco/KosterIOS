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
	try {
		$.showFamilyTrail.add(showDetailMap(interactiveMap, 7, 'Äventyrsleden', 'purple'));
		addClueZone();
		displaySpecificMarkers(7, interactiveMap);
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
// Startar bokstavsjakten, gömmer och visar rätt labels
//-----------------------------------------------------------
function startInteractive() {
	try {
		if (!Ti.Geolocation.locationServicesEnabled) {
			var alertDialog = Ti.UI.createAlertDialog({
				title : 'Påminnelser',
				message : 'Tillåt gpsen för att kunna få påminnelser när du närmar dig en bokstav!'
			});
			alertDialog.show();
		}

		$.btnStartQuiz.hide();
		$.btnStartQuiz.height = 0;

		$.txtLetter.show();
		$.txtLetter.height = '40dp';

		$.lblLetters.show();
		$.lblLetters.height = '40dp';

		$.lblCollectedLetters.show();

		$.viewNext.show();
		$.viewNext.height = '50dp';

		$.lblnextClue.show();
		$.lblnextClue.height = '25dp';

		$.nextClue.show();
		$.nextClue.height = '25dp';
		
		$.lbls1.hide();
		$.lbls1.height = 0;
		
		$.lbls2.hide();
		$.lbls2.height = 0;
		
		$.lbls3.hide();
		$.lbls3.height = 0;
		
		$.lbls4.hide();
		$.lbls4.height = 0;

		$.horizontalView.show();
		$.horizontalView.height = Ti.UI.SIZE;

		getUserPos('letter');
		loadClue(foundLetterId);
		interactiveGPS = true;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

function showCorrectLetters(){
	$.lblCorrectLetters.show();
	$.lblCorrectLetters.height = '40dp';
	$.lblCorrectLetters.text = correctLetters;
	$.btnShowCorrect.hide();
	$.btnShowCorrect.height = 0;
}

//-----------------------------------------------------------
// Laddar in nästa ledtråd om man inte hittar bokstaven
//-----------------------------------------------------------
function toNextClue(lId) {
	try {
		var nextDialog = Ti.UI.createAlertDialog({
			title : 'Gå till nästa',
			message : 'Är du säker på att du vill visa nästa ledtråd?',
			buttonNames : ['Ja, visa nästa ledtråd', 'Stäng']
		});

		nextDialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				setNoLetter(lId);
				loadClue(foundLetterId);
				setLabelText();
			}
		});

		nextDialog.show();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

$.nextClue.addEventListener('click', function(e) {
	toNextClue(foundLetterId);
});

//-----------------------------------------------------------
// Laddar in första ledtråden
//-----------------------------------------------------------
function loadClue(id) {
	var col = fetchAllLetters();
	try {
		if (id < 10) {
			$.lblWelcome.text = "Ledtråd " + id + ":";
			$.lblInfoText.text = col[id - 1].clue;
		} else {
			allLetters();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

Alloy.Globals.loadClue = loadClue;

//-----------------------------------------------------------
// Efter bokstaven validerats läses den upp bland de andra
// bokstäverna i en label
//-----------------------------------------------------------
function sendLetter() {
	try {
		var letter = $.txtLetter.value;
		var sendletter = letter.toUpperCase();

		checkLetter(sendletter);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
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
		messageDialog.message = "Vill du spara bokstaven " + letterToCheck + " och gå vidare till nästa ledtråd?";
		messageDialog.title = 'Bra, du hittade en bokstav!';
		messageDialog.buttonNames = ['Ja, jag vill spara!', 'Stäng'];

		messageDialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				$.txtLetter.value = '';

				setLetterOne(foundLetterId, letterToCheck);
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
	$.lblCollectedLetters.text = 'Bokstäver: ';
	var found = fetchFoundLettersCol();
	foundLetterId++;
	loadClue(foundLetterId);

	for (var i = 0; i < found.length; i++) {
		$.lblCollectedLetters.text += found[i].letter;
	}
}

//-----------------------------------------------------------
// Kontrollerar om man fått ihop alla bokstäver. Om man hittat
// alla bokstäver göms och släcks rätt labels och textfields
//-----------------------------------------------------------
function allLetters() {
	// try {
	if (foundLetterId > 9) {
		$.txtLetter.hide();
		$.txtLetter.height = 0;

		$.lblLetters.hide();
		$.lblLetters.height = 0;

		$.horizontalView.hide();
		$.horizontalView.height = 0;

		$.viewNext.hide();
		$.viewNext.height = 0;

		$.lblnextClue.hide();
		$.lblnextClue.height = 0;

		$.nextClue.hide();
		$.nextClue.height = 0;

		$.btnStartQuiz.height = 0;

		$.wordView.show();
		$.wordView.height = Ti.UI.SIZE;

		$.txtWord.show();
		$.txtWord.height = '40dp';

		$.lblWord.show();
		$.lblWord.height = '40dp';

		$.lblWelcome.text = 'Skriv ordet du bildat av bokstäverna!';
		$.lblInfoText.text = 'Ledtråd: En svävande geléklump i havet.';
		
		$.btnShowCorrect.show();
		$.btnShowCorrect.height = '40dp';
	}
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	// }
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	// try {
	var check = $.txtWord.value;
	var checkword = check.toUpperCase();
	var alertDialog = Ti.UI.createAlertDialog({
		buttonNames : ['Stäng'],
		title : "Fel ord"
	});

	if (checkword == word) {
		$.lblWelcome.text = "Bra jobbat!";
		$.lblWelcome.fontSize = '30dp';

		$.lblInfoText.text = "Du hittade det rätta ordet!";

		$.lblCollectedLetters.text = '';
		$.lblCollectedLetters.hide();

		$.wordView.hide();
		$.wordView.height = 0;

		$.txtWord.hide();
		$.txtWord.height = 0;

		$.lblWord.hide();
		$.lblWord.height = 0;

		Alloy.Globals.stopGame();
		interactiveGPS = false;
	} else if (wrongWord == 3) {
		alertDialog.message = "Nu blev det fel. Vill du kontrollera dina bokstäver? Det här är de korrekta: " + correctLetters;
		alertDialog.show();
	} else if (wrongWord < 3) {
		alertDialog.message = "Försök igen! Du har snart klurat ut det!";
		alertDialog.show();
		wrongWord++;
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
