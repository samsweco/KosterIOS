var letterCollection = getLetterCollection();


function sendLetter() {
	checkLetter(getLetter());
}

function getLetter() {
	var letter = $.txtLetter.value;
	return letter.toUpperCase();
}

function checkLetter(letterToCheck) {
	letterCollection.fetch({
			query : 'SELECT letter FROM letterModel'
		});
	
	var letterJSON = letterCollection.toJSON();
	Ti.API.info(JSON.stringify(letterJSON));
	
	for (var i = 0; i < letterJSON.length; i++) {
		if (letterJSON[i].letter == letterToCheck) {
			//Save letter
			lettersArray.push(letterJSON[i].letter);
			$.lblFoundLetters.text += letterJSON[i].letter;
			alert(letterJSON[i].letter);
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