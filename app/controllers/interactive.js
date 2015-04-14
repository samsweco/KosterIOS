var args = arguments[0] || {};
//var id = 1;

//-----------------------------------------------------------
// Öppnar vy och läser in nästa fråga
//-----------------------------------------------------------
function openNextQuestion() {
	try {
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "quizDetail - openQuiz");
	}
}

exports.openNextQuestion = openNextQuestion;

// function saveLetter() {
// 
	// var save = $.letter.value;
	// stor = save.toUpperCase();
	// $.lblSavedLetters.text = '';
// 
	// if (save == "") {
		// alert("Fyll i den bokstav du hittat");
	// }
	// if (save.length > 1) {
		// alert("Du får enbart fylla i en bokstav");
	// } else {
		// lettersArray.push(stor);
		// for (var i = 0; i < lettersArray.length; i++) {
// 
			// $.lblSavedLetters.text += lettersArray[i];
		// }
	// }
// }

//-----------------------------------------------------------
// Hämta nästa ledtråd
//-----------------------------------------------------------
function getClue(id) {

	var clueCollection = Alloy.Collections.gameLetterModel;
	clueCollection.fetch({
		query : 'SELECT infoText from gameLetterModel where id ="' + id + '"'
	});

	var jsonObj = clueCollection.toJSON();
	var txt = jsonObj[0].infoText;

	var clue = {
		infoText : txt
	};

	var returnclue = JSON.stringify(txt);
	return returnclue;
	// $.lblClue.text = txt;
	// id++;
}

//-----------------------------------------------------------
// Visar en alert-box med validering
//-----------------------------------------------------------

//MAN MÅSTE KUNNA KLICKA STÄNG
function showAlert() {
	var dialog;
	$.lblSavedLetters.text = '';

	if (OS_IOS) {
		dialog = Ti.UI.createAlertDialog({
			title : getClue(1),
			style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
			buttonNames : ['OK', 'stäng']
		});

		dialog.addEventListener('click', function(e) {
			if (e.text == "") {
				alert("Fyll i den bokstav du hittat");
				dialog.show();
			}
			if (e.text.length > 1) {
				alert("Du får enbart fylla i en bokstav");
				dialog.show();
			} else {
				lettersArray.push(e.text);
				
				for (var i = 0; i < lettersArray.length; i++) {

					$.lblSavedLetters.text += lettersArray[i];
				}
			}
		});
	}
	if (OS_ANDROID) {
		var textfield = Ti.UI.createTextField();
		dialog = Ti.UI.createAlertDialog({
			title : 'Skriv in din bokstav',
			androidView : textfield,
			buttonNames : ['OK', 'stäng']
		});
	}

	dialog.show();
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	var check = $.word.value;
	check.toLowerCase();

	if (check == word) {
		alert("Bra jobbat!");
	} else {
		alert("Nej du, nu blev det fel...");
	}
}
