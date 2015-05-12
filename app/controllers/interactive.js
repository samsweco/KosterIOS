Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};

var letters = Alloy.createModel('letterModel');
letters.save({
	id : 13,
	letter : "Y",
	found : 0
});
letters.fetch();

Ti.API.info('letters : ' + JSON.stringify(letters));


var letterCollection = getLetterCollection();
letterCollection.fetch();
jsonCollection = letterCollection.toJSON();
Alloy.Globals.jsonCollection = jsonCollection; 
	
// letterCollection.save({id:13, clue:'hejhej', found:1});
// Ti.API.info('letterCol : ' + JSON.stringify(letterCollection));
	
displayMap();

function displayMap() {
	$.showFamilyTrail.add(showDetailMap(interactiveMap, 7, 'Äventyrsleden', 'purple'));
	addClueZone();
	displaySpecificMarkers(7, interactiveMap);
}

// function getCollection(){
	// var letterCollection = getLetterCollection();
	// letterCollection.fetch({
		// query : 'SELECT * FROM letterModel WHERE found =' + 0
	// });
// 	
	// jsonCollection = letterCollection.toJSON();
	// Alloy.Globals.jsonCollection = jsonCollection;
// }

function startInteractive() {
	$.btnStartQuiz.hide();
	$.btnStartQuiz.height = 0;

	$.txtLetter.show();
	$.txtLetter.height = '40dp';

	$.lblLetters.show();
	$.lblLetters.height = '40dp';

	$.lblCollectedLetters.show();

	$.horizontalView.show();
	$.horizontalView.height = Ti.UI.SIZE;

	getUserPos('letter');
	loadClue(1);
}

function loadClue(id) {
	$.lblWelcome.text = "Ledtråd " + id + ":";
	$.lblInfoText.text = jsonCollection[id - 1].clue;
}

function sendLetter() {
	checkLetter(getLetter());
	interactiveMap.removeAllAnnotations();
	addClueZone();
	displaySpecificMarkers(7, interactiveMap);
	allLetters();
}

function getLetter() {
	var letter = $.txtLetter.value;
	return letter.toUpperCase();
}

function nextClue() {
	$.lblWelcome.text = "Ledtråd " + nextId + ":";
	var nextClue = Alloy.Globals.jsonCollection[nextId].clue;
	$.lblInfoText.text = nextClue;
}

function checkLetter(letterToCheck) {
	var messageDialog = Ti.UI.createAlertDialog({
		buttonNames : ['Stäng']
	});
	
	Ti.API.info('rätt bokstav är : ' + Alloy.Globals.jsonCollection[foundId - 1].letter);
	
	if (Alloy.Globals.jsonCollection[foundId - 1].letter == letterToCheck) {
		if (Alloy.Globals.jsonCollection[foundId - 1].found == 0){ // && Alloy.Globals.jsonCollection[foundId - 1].alerted == 1) {
		
			lettersArray.push(letterToCheck);

			$.lblCollectedLetters.text = $.lblCollectedLetters.text + letterToCheck;
			$.txtLetter.value = '';

			Alloy.Globals.jsonCollection[foundId - 1].found = 1;
			nextId++;
			nextClue();
			
			Ti.API.info('globala collen : ' + JSON.stringify(Alloy.Globals.jsonCollection[0].found));
	}
		} else {
		messageDialog.message = "Är du säker på att det är rätt bokstav?";
		messageDialog.title = "Fel";
		$.txtLetter.value = '';
		messageDialog.show();
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
		$.wordView.height = Ti.UI.SIZE;

		$.lblWelcome.text = 'Skriv ordet du bildat av bokstäverna!';
		$.lblInfoText.text = 'Ledtråd: En svävande geléklump i havet.';
	}
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	var check = $.txtWord.value;
	check.toUpperCase();

	if (check == word) {
		alert("Bra jobbat! Du hittade det rätta ordet!");
		$.lblWelcome.text = "Välkommen till bokstavsjakten!";
		$.lblInfoText.text = "Vandra äventyrslingan och leta efter de 8 bokstäverna! som finns gömda längs leden, försök sedan klura ut det hemliga ordet. Längs vägen kommer du få ledtrådar var du kan finna bokstäverna och vi kommer även påminna dig när du börjar närma dig en bokstav.";
		$.btnStartQuiz.visible = true;
		$.btnStartQuiz.height = "30dp";
		$.txtLetter.hide();
		$.txtLetter.height = '0dp';
		$.lblLetters.hide();
		$.lblLetters.height = '0dp';
		$.lblCollectedLetters.text = '';
		$.wordView.visible = false;
		$.horizontalView.visible = false;
		interactiveMap.removeAllAnnotations();
		displayMap();
	} else {
		alert("Försök igen! Du har snart klurat ut det!");
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

function addClueZone() {
	try {
		for (var c = 0; c < Alloy.Globals.jsonCollection.length; c++) {
			var markerAnnotation = MapModule.createAnnotation({
				latitude : Alloy.Globals.jsonCollection[c].latitude,
				longitude : Alloy.Globals.jsonCollection[c].longitude
			});

			if (Alloy.Globals.jsonCollection[c].found == 0) {
				markerAnnotation.image = '/images/red.png';
			} else {
				markerAnnotation.image = '/images/green.png';
			}

			interactiveMap.addAnnotation(markerAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapFunctions - addClueZone");
	}
}