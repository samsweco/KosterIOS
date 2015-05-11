Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};
var nextId = 1;

var letterCollection = getLetterCollection();
letterCollection.fetch();
var jsonCollection = letterCollection.toJSON();
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

	if (Alloy.Globals.jsonCollection[foundId - 1].letter == letterToCheck) {
		lettersArray.push(Alloy.Globals.jsonCollection[foundId - 1].letter);
		Alloy.Globals.jsonCollection[foundId - 1].found = 1;

		$.lblCollectedLetters.text = $.lblCollectedLetters.text + letterToCheck;
		$.txtLetter.value = '';
		loadClue(Alloy.Globals.jsonCollection[foundId - 1].id);
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
		$.txtLetter.hide();
		$.txtLetter.height = '0dp';
		$.lblLetters.hide();
		$.lblLetters.height = '0dp';
		$.lblCollectedLetters.text = '';
		$.wordView.visible = false;
		$.horizontalView.visible = false;
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






var deviceToken = null;

function clickPush() {

	// Check if the device is running iOS 8 or later
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {

		// Wait for user settings to be registered before registering for push notifications
		Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {

			// Remove event listener once registered for push notifications
			Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

			Ti.Network.registerForPushNotifications({
				success : deviceTokenSuccess,
				error : deviceTokenError,
				callback : receivePush
			});
		});

		// Register notification types to use
		Ti.App.iOS.registerUserNotificationSettings({
			types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
		});
	}

	// For iOS 7 and earlier
	else {
		Ti.Network.registerForPushNotifications({
			// Specifies which notifications to receive
			types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
			success : deviceTokenSuccess,
			error : deviceTokenError,
			callback : receivePush
		});
	}

}

// Process incoming push notifications
function receivePush(e) {
	alert('Received push: ' + JSON.stringify(e));
}

// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {
	deviceToken = e.deviceToken;
}

function deviceTokenError(e) {
	alert('Failed to register for push notifications! ' + e.error);
}
