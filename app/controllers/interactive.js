Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};

//-----------------------------------------------------------
// Hämtar letterCollection
//-----------------------------------------------------------
try {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch();
	jsonCollection = letterCollection.toJSON();
	Alloy.Globals.jsonCollection = jsonCollection;
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - create letterCollection");
}

displayMap();

//-----------------------------------------------------------
// Visar kartan med de olika sevärdheterna och ledtrådsplupparna
//-----------------------------------------------------------
function displayMap() {
	try {
		$.showFamilyTrail.add(showDetailMap(interactiveMap, 7, 'Äventyrsleden', 'purple'));
		addClueZone();
		displaySpecificMarkers(7, interactiveMap);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - displaymap");
	}
}

//-----------------------------------------------------------
// Startar bokstavsjakten, gömmer och visar rätt labels
//-----------------------------------------------------------
function startInteractive() {
	$.btnStartQuiz.hide();
	$.btnStartQuiz.height = 0;

	$.txtLetter.show();
	$.txtLetter.height = '40dp';

	$.lblLetters.show();
	$.lblLetters.height = '40dp';

	$.lblCollectedLetters.show();
	$.lblCollectedLetters.text = 'Bokstäver: ';

	$.viewNext.show();
	$.viewNext.height = '60dp';

	$.horizontalView.show();
	$.horizontalView.height = Ti.UI.SIZE;

	getUserPos('letter');
	loadClue(foundJSON.length + 1);
}

//-----------------------------------------------------------
// Laddar in nästa ledtråd om man inte hittar bokstaven
//-----------------------------------------------------------
$.nextClue.addEventListener('click', function() {
	var nextDialog = Ti.UI.createAlertDialog({
		title : 'Gå till nästa',
		message : 'Är du säker på att du inte hittar bokstaven?',
		buttonNames : ['Ja, visa nästa ledtråd', 'Stäng']
	});

	nextDialog.addEventListener('click', function(e) {
		if (e.index == 0) {
			if (lettersModel.get('found') != 1) {
				checkLetter(lettersModel.get('letter'));
			}
		}
	});

	nextDialog.show();
});

//-----------------------------------------------------------
// Laddar in första ledtråden
//-----------------------------------------------------------
function loadClue(id) {
	try {
		$.lblWelcome.text = "Ledtråd " + id + ":";
		$.lblInfoText.text = jsonCollection[id - 1].clue;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - loadClue");
	}
}

//-----------------------------------------------------------
// Efter bokstaven validerats läses den upp bland de andra
// bokstäverna i en label
//-----------------------------------------------------------
function sendLetter() {
	try {
		var letter = $.txtLetter.value;
		var sendletter = letter.toUpperCase();

		checkLetter(sendletter);
		allLetters();

		$.lblCollectedLetters.text = 'Bokstäver:  ' + foundJSON;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - sendLetter");
	}
}

//-----------------------------------------------------------
// Validerar bokstaven som skrivits in, sätter found till
// 1 i letterModel och läser upp nästa ledtråd
//-----------------------------------------------------------
function checkLetter(letterToCheck) {
	try {
		var messageDialog = Ti.UI.createAlertDialog({
			title : 'Ojdå, nu blev det fel',
			buttonNames : ['Stäng']
		});

		// if (lettersModel.get('letter') == letterToCheck && lettersModel.get('found') == 0) {
		if (letterToCheck.length > 1) {
			messageDialog.message = "Man får bara skriva in en bokstav.";
			messageDialog.show();
		} else if (letterToCheck.length < 1) {
			messageDialog.message = "Man måste skriva in en bokstav.";
			messageDialog.show();
		} else if (lettersModel.get('found') == 1) {
			messageDialog.message = "Du har redan skrivit in din bokstav. Leta lite längre fram på leden efter nästa.";
			messageDialog.show();
		} else {
			$.txtLetter.value = '';

			lettersModel.set({
				'found' : 1,
				'letter' : letterToCheck
			});
			lettersModel.save();

			loadClue(lettersModel.get('id') + 1);
			getFound();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - checkLetter");
	}
}

//-----------------------------------------------------------
// Kontrollerar om man fått ihop alla bokstäver. Om man hittat / alla bokstäver göms och släcks rätt labels och textfields
//-----------------------------------------------------------
function allLetters() {
	try {
		if (word.length == foundJSON.length) {
			$.txtLetter.hide();
			$.txtLetter.height = 0;
			$.lblLetters.hide();
			$.lblLetters.height = 0;
			$.viewNext.hide();
			$.viewNext.height = 0;
			$.btnStartQuiz.height = 0;
			$.wordView.show();
			$.wordView.height = '50dp';

			$.lblWelcome.text = 'Skriv ordet du bildat av bokstäverna!';
			$.lblInfoText.text = 'Ledtråd: En svävande geléklump i havet.';
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - allLetters");
	}
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	try {
		var check = $.txtWord.value;
		var checkword = check.toUpperCase();

		if (checkword == word) {
			alert("Bra jobbat! Du hittade det rätta ordet!");

			$.lblWelcome.text = "Bra jobbat!";
			$.lblWelcome.fontSize = '30dp';

			// $.lblInfoText.text = "";
			$.lblInfoText.hide();
			$.lblInfoText.height = '0dp';

			$.txtLetter.hide();
			$.txtLetter.height = '0dp';

			$.lblLetters.hide();
			$.lblLetters.height = '0dp';

			$.lblCollectedLetters.text = '';

			$.wordView.visible = false;
			$.horizontalView.visible = false;

			stopGame();
			startOver();
		} else {
			alert("Försök igen! Du har snart klurat ut det!");
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - checkWord");
	}
}

Titanium.App.addEventListener('close', function() {
	startOver();
});

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
interactiveMap.addEventListener('click', function(evt) {
	if (evt.clicksource == 'rightButton') {
		showHotspot(evt.annotation.id);
	}
}); 