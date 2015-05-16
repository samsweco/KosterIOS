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
	$.lblCollectedLetters.text = 'Bokstäver: ';

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
	allLetters();
	
	$.lblCollectedLetters.text = 'Bokstäver:  ' + foundJSON;
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

	if (lettersModel.get('letter') == letterToCheck && lettersModel.get('found') == 0) {// && Alloy.Globals.jsonCollection[foundId - 1].alerted == 1) {
		lettersArray.push(letterToCheck);

		$.txtLetter.value = '';

		// Alloy.Globals.jsonCollection[foundId - 1].found = 1;
		lettersModel.set({
			'found' : 1
		});
		lettersModel.save();

		Ti.API.info('uppdaterad : ' + JSON.stringify(lettersModel));

		foundId++;
		nextId++;
		nextClue();
		getFound();
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
		
		// foundJSON = null;
		
		// TO DO: destroy'a model
		// $.destroy();
		// lettersModel.destroy();
		// letterCollection.destroy();
	
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