Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};

var foundLetterId = 1;
var wrongWord = 0;
var correctLetters = "A, T, R, Ö, N, N, E, M, O";

//-----------------------------------------------------------
// Hämtar letterCollection
//-----------------------------------------------------------
try {
	var letterColl = Alloy.Collections.letterModel;
	letterColl.fetch();
	jsonCollection = letterColl.toJSON();
	Alloy.Globals.jsonCollection = jsonCollection;	
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
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
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

//-----------------------------------------------------------
// Startar bokstavsjakten, gömmer och visar rätt labels
//-----------------------------------------------------------
function startInteractive() {		
	try {
		if (Ti.Geolocation.locationServicesEnabled) {

			$.btnStartQuiz.hide();
			$.btnStartQuiz.height = 0;

			$.txtLetter.show();
			$.txtLetter.height = '40dp';

			$.lblLetters.show();
			$.lblLetters.height = '40dp';

			$.lblCollectedLetters.show();
			$.lblCollectedLetters.text = 'Bokstäver: ';

			$.viewNext.show();
			$.viewNext.height = '50dp';
			
			$.lblnextClue.show();
			$.lblnextClue.height = '25dp';
			
			$.nextClue.show();
			$.nextClue.height = '25dp';
			
			$.horizontalView.show();
			$.horizontalView.height = Ti.UI.SIZE;

			getUserPos('letter');
			loadClue(foundLetterId);
			interactiveGPS = true;

		} else {
			alert('Tillåt gpsen för att få , tack');
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}


//-----------------------------------------------------------
// Laddar in nästa ledtråd om man inte hittar bokstaven
//-----------------------------------------------------------
function toNextClue() {
	try {
		var nextDialog = Ti.UI.createAlertDialog({
			title : 'Gå till nästa',
			message : 'Är du säker på att du inte hittar bokstaven?',
			buttonNames : ['Ja, visa nästa ledtråd', 'Stäng']
		});

		nextDialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				if (Alloy.Globals.jsonCollection[foundLetterId-1].found == 0) {					
					checkLetter(Alloy.Globals.jsonCollection[foundLetterId-1].letter);
					$.lblCollectedLetters.text = 'Bokstäver:  ' + foundJSON;
				}
			}
		});

		nextDialog.show();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

//-----------------------------------------------------------
// Laddar in första ledtråden
//-----------------------------------------------------------
function loadClue(id) {
	try {
		if (id < 10){
			$.lblWelcome.text = "Ledtråd " + id + ":";
			$.lblInfoText.text = Alloy.Globals.jsonCollection[id - 1].clue; 
		} else {
			allLetters();
		}
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
	try {
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
					
					foundLettersModel.fetch({
						'id' : foundLetterId
					});

					foundLettersModel.set({
						'letter' : letterToCheck,
						'found' : 1
					});
					foundLettersModel.save();
					
					Alloy.Globals.jsonCollection[foundLetterId-1].found = 1;

					foundLetterId++;
					foundJSON.push(' ' + letterToCheck);
					loadClue(foundLetterId);
					
					$.lblCollectedLetters.text = 'Bokstäver:  ' + foundJSON;
				}
			}); 

			messageDialog.show(); 
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

// function stepBack(){
	// loadClue(foundLetterId-1);
// }

//-----------------------------------------------------------
// Kontrollerar om man fått ihop alla bokstäver. Om man hittat / alla bokstäver göms och släcks rätt labels och textfields
//-----------------------------------------------------------
function allLetters() {
	try {
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
			$.wordView.height = '80dp';
			
			$.txtWord.show();
			$.txtWord.height = '40dp';

			$.lblWord.show();
			$.lblWord.height = '40dp';
			

			$.lblWelcome.text = 'Skriv ordet du bildat av bokstäverna!';
			$.lblInfoText.text = 'Ledtråd: En svävande geléklump i havet.';
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

			stopGame();
			interactiveGPS = false;
		} else if(wrongWord == 3){
			alertDialog.message = "Nu blev det fel. Vill du kontrollera dina bokstäver? Det här är de korrekta: " + correctLetters;
			alertDialog.show();
		} else {
			alertDialog.message = "Försök igen! Du har snart klurat ut det!";
			alertDialog.show();
			wrongWord++;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten");
	}
}

Titanium.App.addEventListener('close', function() {
	Alloy.Globals.stopGame();
});

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
interactiveMap.addEventListener('click', function(evt) {
	if (evt.clicksource == 'rightButton') {
		showHotspot(evt.annotation.id);
	}
}); 