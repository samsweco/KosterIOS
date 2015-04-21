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
			query : 'SELECT * FROM letterModel where id = "' + foundId + '"'
		});
	
	var letterJSON = letterCollection.toJSON();
	
	Ti.API.info(JSON.stringify(letterJSON));
	//Skriv om denna loop så att den kollar id't på bokstaven, alltså platsen i arrayen och kollar om den stämmer...
	
		if (letterJSON[0].letter == letterToCheck) {
			lettersArray.push(letterJSON[0].letter);
			Ti.API.info(JSON.stringify(lettersArray));
		}
}

function showInteractive(id) {
	if (!interactiveVisible) {
		$.interactiveView.show();
		interactiveVisible = true;
	} else {
		$.interactiveView.hide();
		interactiveVisible = false;
	}
	foundId = id;
	
}

function closeInteractive() {
	$.interactiveView.hide();
	interactiveVisible = false;
}

Alloy.Globals.showInteractive = showInteractive;
Alloy.Globals.closeInteractive = closeInteractive;