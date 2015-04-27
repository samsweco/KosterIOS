// var letterCollection = getLetterCollection();
// 
// 
// 
// function sendLetter() {
	// checkLetter(getLetter());
// }
// 
// function getLetter() {
	// var letter = $.txtLetter.value;
	// if (validate(letter)) {
		// return letter.toUpperCase();
	// };
// }
// 
// function checkLetter(letterToCheck) {
	// var correctLetter = false;
// 	
	// letterCollection.fetch({
			// query : 'SELECT * FROM letterModel where id = "' + foundId + '"'
		// });
// 	
	// var letterJSON = letterCollection.toJSON();
	// //Skriv om denna loop så att den kollar id't på bokstaven, alltså platsen i arrayen och kollar om den stämmer...
// 	
		// if (letterJSON[0].letter == letterToCheck) {
			// lettersArray.push(letterJSON[0].letter);
			// Ti.API.info(JSON.stringify(lettersArray));
		// }
// }

function showInteractive(clueTxt) {
	if (!interactiveVisible) {
		$.interactive.height = '100dp';
		$.interactive.visible = true;
		$.lblClue.text = clueTxt;
		interactiveVisible = true;
		alert("hej");
	} else {
		$.interactive.visible = false;
		interactiveVisible = false;
	}	
}

Alloy.Globals.showInteractive = showInteractive;

function closeInteractive() {
	$.interactive.hide();
	interactiveVisible = false;
}

Alloy.Globals.closeInteractive = closeInteractive;