Ti.include("geoFunctions.js");

$.tabs.open();
Alloy.CFG.tabs = $.tabs;
exports.toInteractive = toInteractive;

//-----------------------------------------------------------
// Metoder för navigering
//-----------------------------------------------------------

function toMap() {
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
}

function toInteractive() {
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
}

function toTrails() {
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
}

function toInfo() {
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
}

//-----------------------------------------------------------
// Null'ar varje fönster när man trycker på en annan tab.
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

function showMapMenu() {
	Alloy.Globals.showMapMenuWidget();
}

function getPos() {
	if(myPosition == false){
		getPosition();
		myPosition = true;
	}else{
		setRegion();
		myPosition = false;
	}
}
