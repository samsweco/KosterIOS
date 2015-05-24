Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

$.tabs.open();
Alloy.CFG.tabs = $.tabs;
exports.toInteractive = toInteractive;

//-----------------------------------------------------------
// Metoder för navigeringen
//-----------------------------------------------------------
function toMap() {
	try {
		var mapWind = Alloy.createController('map').getView();
		$.mapWin.add(mapWind);

		var mapwinTitle = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontFamily : 'Raleway-Medium'
			},
			text : 'Karta'
		});

		$.mapWin.titleControl = mapwinTitle;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Förstasidan");
	}
}

function toInteractive() {
	try {
		var interactive = Alloy.createController('interactive').getView();
		$.interactiveWin.add(interactive);

		var interacwinTitle = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontFamily : 'Raleway-Medium'
			},
			text : 'Bokstavsjakt'
		});

		$.interactiveWin.titleControl = interacwinTitle;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Förstasidan");
	}
}

function toTrails() {
	try {
		var trails = Alloy.createController('trails').getView();
		$.hikeWin.add(trails);

		var hikewinTitle = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontFamily : 'Raleway-Medium'
			},
			text : 'Vandringsleder'
		});

		$.hikeWin.titleControl = hikewinTitle;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Förstasidan");
	}
}

function toInfo() {
	try {
		var info = Alloy.createController('infoList').getView();
		$.infoWin.add(info);

		var infowinTitle = Ti.UI.createLabel({
			font : {
				fontSize : '16dp',
				fontFamily : 'Raleway-Medium'
			},
			text : 'Information'
		});

		$.infoWin.titleControl = infowinTitle;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Förstasidan");
	}
}

//-----------------------------------------------------------
// Null'ar varje fönster när man trycker på en annan tab,
// för att minska risk för minnesläcka
//-----------------------------------------------------------

$.mapWin.addEventListener('blur', function() {
	$.mapWin = null;
});

$.interactiveWin.addEventListener('blur', function() {
	$.interactiveWin = null;
});

$.hikeWin.addEventListener('blur', function() {
	$.hikeWin = null;
});

$.infoWin.addEventListener('blur', function() {
	$.infoWin = null;
});

$.koster.addEventListener('blur', function() {
	$.koster = null;
});

//-----------------------------------------------------------
// Null'ar varje fönster när man trycker på en annan tab,
// för att minska risk för minnesläcka
//-----------------------------------------------------------
function showMapMenu() {
	if(!menuMapVisible){
		Alloy.Globals.openMenu();
		menuMapVisible = true;
	}else{
		Alloy.Globals.closeMenu();
		menuMapVisible = false;
	}
}
	

