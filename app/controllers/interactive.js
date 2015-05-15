Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};



var letterCollection = Alloy.Collections.letterModel;
letterCollection.fetch();
jsonCollection = letterCollection.toJSON();
Alloy.Globals.jsonCollection = jsonCollection; 
	
displayMap();

function displayMap() {
	$.showFamilyTrail.add(showDetailMap(interactiveMap, 7, 'Äventyrsleden', 'purple'));
	addClueZone();
	displaySpecificMarkers(7, interactiveMap);
} 

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
	
	// fetchModel();
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
	
	Ti.API.info('rätt bokstav är : ' + lettersModel.get('letter'));
	
	if (lettersModel.get('letter') == letterToCheck && lettersModel.get('found') == 0) { // && Alloy.Globals.jsonCollection[foundId - 1].alerted == 1) {
			lettersArray.push(letterToCheck);

			$.lblCollectedLetters.text = $.lblCollectedLetters.text + letterToCheck;
			$.txtLetter.value = '';

			// Alloy.Globals.jsonCollection[foundId - 1].found = 1;
			lettersModel.set({
				'found' : 1
			});
			lettersModel.save();
			
			foundId++;
			nextId++;
			nextClue();
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
		
		lettersArray = null;
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
		
		//Ändrade till letterModel från den globala collectionen men nu syns de inte
		
		for (var c = 0; c < lettersModel.length; c++) {
			var markerAnnotation = MapModule.createAnnotation({
				latitude : lettersModel.get('latitude'),
				longitude : lettersModel.get('longitude')
			});

			if (lettersModel.get('found') == 0) {
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