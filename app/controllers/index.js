Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

$.tabs.open();
Alloy.CFG.tabs = $.tabs;
exports.toInteractive = toInteractive;

var infoVisible = false;

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
// Öppnar och stänger menyn på "stora kartan"
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

//-----------------------------------------------------------
// Skickar till båtleden från startsidan
//-----------------------------------------------------------
function openBoat(){
	var args = {
		id : 8,
		title : 'Båtresan',
		length : 10,
		infoTxt : 'Välkommen på båtturen mellan Strömstad och Koster. Turen är cirka 10 km lång och tar mellan 30 och 60 minuter. Under resan kommer du få lite information om Kosterhavet och livet där.',
		area : 'Strömstad-Koster',
		zoomlat : '58.936458',
		zoomlon : '11.172279',
		color : 'boat'
	};

	var trailDetail = Alloy.createController("trailDetail", args).getView();
	Alloy.CFG.tabs.activeTab.open(trailDetail);
}

//-----------------------------------------------------------
// Visar infoWidget
//-----------------------------------------------------------
function showInfo(){
	if(!infoVisible){
		$.widgetInfo.show();
		$.widgetInfo.height = '80%';
		infoVisible = true;
	} else {
		$.widgetInfo.hide();
		$.widgetInfo.height = 0;
		infoVisible = false;
	}
}

$.frontView.addEventListener('click', function(){
	if(infoVisible){
		$.widgetInfo.hide();
		$.widgetInfo.height = 0;
		infoVisible = false;
	}
});
