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

	$.horizontalView.show();
	$.horizontalView.height = Ti.UI.SIZE;

	getUserPos('letter');
	loadClue(1); 
}

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
			buttonNames : ['Stäng']
		});

		if (lettersModel.get('letter') == letterToCheck && lettersModel.get('found') == 0) {
			$.txtLetter.value = '';

			lettersModel.set({
				'found' : 1
			});
			lettersModel.save();

			loadClue(lettersModel.get('id') + 1);
			getFound();
		} else {
			messageDialog.message = "Är du säker på att det är rätt bokstav?";
			messageDialog.title = "Fel";
			$.txtLetter.value = '';
			messageDialog.show();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - checkLetter");
	}
}

//-----------------------------------------------------------
// Kontrollerar om man fått ihop alla bokstäver. Om man hittat 
// alla bokstäver göms och släcks rätt labels och textfields
//-----------------------------------------------------------
function allLetters() {
	try {
		if (word.length == foundJSON.length) {
			$.txtLetter.hide();
			$.txtLetter.height = 0;
			$.lblLetters.hide();
			$.lblLetters.height = 0;
			$.btnStartQuiz.height = 0;
			$.wordView.show();
			$.wordView.height = Ti.UI.SIZE;

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
		check.toUpperCase();

		if (check == word) {
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

			for (var lid = 0; lid < foundJSON.length; lid++) {
				var letterid = lid + 1;

				lettersModel.fetch({
					'id' : letterid
				});
				lettersModel.set({
					'found' : 0,
					'alerted' : 0
				});
				lettersModel.save();
			}

			stopGame();

		} else {
			alert("Försök igen! Du har snart klurat ut det!");
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - checkWord");
	}	
}

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
interactiveMap.addEventListener('click', function(evt) {
	if (evt.clicksource == 'rightButton') {
		showHotspot(evt.annotation.id);
	}
});