Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};
var zoomedName = args.name;
var zoomColor = args.color;
var zoomLat = args.zoomlat;

var menuVisible = false;

displayBigMap();

//-----------------------------------------------------------
// Sätter label med rätt font som windowtitle
//-----------------------------------------------------------
var windowTitle = Ti.UI.createLabel({
	text: String.format(L('map_row'), ''),
	font: {
		fontSize: '17dp',
		fontFamily: 'Raleway-Medium'
	}
});
$.mapWindow.titleControl = windowTitle;

//-----------------------------------------------------------
// Visar kartan
//-----------------------------------------------------------
function displayBigMap() {
	try {
		$.mapView.add(showMap(map));
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	}
}

//-----------------------------------------------------------
// Öppnar trailDetail med info om vald vandringsled
//-----------------------------------------------------------
function showTrail(myId) {
	try {
		var jsonObjTrail = returnSpecificTrail(myId);

		var args = {
			id : jsonObjTrail[0].id,
			title : myId,
			length : jsonObjTrail[0].length,
			infoTxt : jsonObjTrail[0].infoTxt,
			area : jsonObjTrail[0].area,
			color : jsonObjTrail[0].color,
			zoomlat : jsonObjTrail[0].zoomLat,
			zoomlon : jsonObjTrail[0].zoomLon
		};

		var trailDetail = Alloy.createController("trailDetail", args).getView();
		$.mapNav.openWindow(trailDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	}
}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspotDet(hotId) {		
	try {
		var jsonObjHot = returnSpecificHotspotsByName(hotId);
		var hotspotId;
		var x;
		var y;
		
		if(jsonObjHot[0].id == 32){
			hotspotId = 42;
			x = 58.893085;
			y = 11.047972;
		} else {
			hotspotId = jsonObjHot[0].id;
			x = jsonObjHot[0].xkoord;
			y = jsonObjHot[0].ykoord;
		}

		var hotspotTxt = {
			title : jsonObjHot[0].name,
			infoTxt : jsonObjHot[0].infoTxt,
			id : hotspotId,
			x : x,
			y : y
		};

		var hotDet = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		$.mapNav.openWindow(hotDet);
		
		hotspotDetail = null;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!");
	}
}

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
map.addEventListener('click', function(evt){
	closeMenu();
	
	if (evt.clicksource == 'rightButton') {
		if (evt.annotation.name == 'hotspot') {
			showHotspotDet(evt.annotation.id);
		} else if (evt.annotation.name == 'trail') {
			showTrail(evt.annotation.id);
		}
	}
});

//-----------------------------------------------------------
// Eventlistener för att stänga menyn vid klick på kartan
//-----------------------------------------------------------
map.addEventListener('singletap', function(e) {
	closeMenu();
});

//-----------------------------------------------------------
// Funktioner för att visa och stänga kartmenyn 
//-----------------------------------------------------------
function openMenu(){
	$.widgetView.height = '190dp';
	menuMapVisible = true;
}
Alloy.Globals.openMenu = openMenu;

function closeMenu(){
	$.widgetView.height = '0dp';
	menuMapVisible = false;
}
Alloy.Globals.closeMenu = closeMenu;

//-----------------------------------------------------------
// Öppnar och stänger menyn på "stora kartan"
//-----------------------------------------------------------
function showMapMenu() {
	if(!menuMapVisible){
		openMenu();
		menuMapVisible = true;
	}else{
		closeMenu();
		menuMapVisible = false;
	}
}

//-----------------------------------------------------------
// Funktion för att rensa kartan när man stänger den
//-----------------------------------------------------------
function closeBigMap(){
	reloadMap();
}


