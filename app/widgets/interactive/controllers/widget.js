var letterCollection = getLetterCollection();


function sendLetter() {
	checkLetter(getLetter());
}

function getLetter() {
	var letter = $.txtLetter.value;
	if (validate(letter)) {
		return letter.toUpperCase();
	};
}

function checkLetter(letterToCheck) {
	var correctLetter = false;
	
	letterCollection.fetch({
			query : 'SELECT letter FROM letterModel'
		});
	
	var letterJSON = letterCollection.toJSON();
	//Skriv om denna loop så att den kollar id't på bokstaven, alltså platsen i arrayen och kollar om den stämmer...
	
	for (var i = 0; i < letterJSON.length; i++) {
		if (letterJSON[i].letter == letterToCheck) {
			lettersArray.push(letterJSON[i].letter);
			Ti.API.info(JSON.stringify(lettersArray));
		}
	}
	
}

function showInteractive() {
	if (!interactiveVisible) {
		$.interactiveView.show();
		interactiveVisible = true;
	} else {
		$.interactiveView.hide();
		interactiveVisible = false;
	}
}

function closeInteractive() {
	$.interactiveView.hide();
	interactiveVisible = false;
}

Alloy.Globals.showInteractive = showInteractive;
Alloy.Globals.closeInteractive = closeInteractive;