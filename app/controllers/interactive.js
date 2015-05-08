Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};
var nextId = 1;

var letterCollection = getLetterCollection();
letterCollection.fetch();
var jsonCollection = letterCollection.toJSON();
Alloy.Globals.jsonCollection = jsonCollection;

displayMap();

function displayMap(){
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

function nextClue(){
	$.lblWelcome.text = "Ledtråd " + nextId + ":";
	var nextClue = Alloy.Globals.jsonCollection[nextId].clue;
	$.lblInfoText.text = nextClue;
}

function checkLetter(letterToCheck) {
	if (Alloy.Globals.jsonCollection[foundId - 1].letter == letterToCheck) {
		lettersArray.push(Alloy.Globals.jsonCollection[foundId - 1].letter);
		Alloy.Globals.jsonCollection[foundId - 1].found = 1;

		$.lblCollectedLetters.text = $.lblCollectedLetters.text + letterToCheck;
		$.txtLetter.value = '';
		loadClue(Alloy.Globals.jsonCollection[foundId-1].id);
		nextId++;
		nextClue();
	} else {
		alert("Är du säker på att " + letterToCheck + " är rätt bokstav?");
		$.txtLetter.value = '';
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
		$.lblWelcome.text = 'Skriv ordet du bildat av bokstäverna!';
		$.lblInfoText.text = 'Ledtråd: En svävande geléklump i havet.';
	}
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	var check = $.txtWord.value;

	if (check == word) {
		alert("Bra jobbat! Du hittade det rätta ordet!");
		$.lblWelcome.text = "Välkommen till bokstavsjakten!";
		$.lblInfoText.text = "Vandra äventyrslingan och leta efter de 8 bokstäverna! som finns gömda längs leden, försök sedan klura ut det hemliga ordet. Längs vägen kommer du få ledtrådar var du kan finna bokstäverna och vi kommer även påminna dig när du börjar närma dig en bokstav.";
		$.btnStartQuiz.visible = true;
		$.btnStartQuiz.height = "30dp";
		$.txtLetter.close();
		$.txtLetter.height = '0dp';
		$.lblLetters.close();
		$.lblLetters.height = '0dp';
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
