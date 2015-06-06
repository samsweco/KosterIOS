Ti.include('geoFunctions.js');
selectTrailPics();
function selectTrailPics() {
	// try {
	var letterJSON = fetchAllLetters();

	for (var i = 0; i < letterJSON.length; i++) {
		var letter_view = Ti.UI.createView({
			height : '100%',
			width : Ti.UI.FILL,
			top : '0dp',
			layout : 'vertical'
		});

		var clueTitle = Ti.UI.createLabel({
			left : '15dp',
			top : '15dp',
			text : 'Ledtråd ' + (i+1),
			color : 'black',
			font : {
				fontSize : '16dp',
				fontStyle : 'italic',
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				fontFamily : 'Raleway-Medium'
			}
		});

		var clueTxt = Ti.UI.createLabel({
			left : '15dp',
			top : '15dp',
			text : letterJSON[i].clue,
			color : 'black',
			font : {
				fontSize : 12,
				fontStyle : 'italic',
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				fontFamily : 'Raleway-Medium'
			}
		});


		var backgroundView = Ti.UI.createView({
			layout : 'vertical',
			backgroundColor : 'green',
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE
		});
		letter_view.add(clueTitle);
		letter_view.add(clueTxt);
		backgroundView.add(letter_view);

		$.slides.addView(backgroundView);
	}
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "Interactive - widget");
	// }
}