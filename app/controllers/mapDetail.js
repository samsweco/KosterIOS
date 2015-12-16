Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};
var trailName = args.title;
var trailColor = args.color;
var trailId = args.id;
var zoomLat = args.zoomlat;
var zoomLon = args.zoomlon;

var menuDetailVisible = false;

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
detailMap.removeAllAnnotations();
showMapDetail();
getSpecificIconsForTrail(trailId, detailMap);
displaySpecificMarkers(trailId, detailMap);
	
if(hotspotGPS){
	$.geoSwitch1.value = true;
} else {
	$.geoSwitch1.value = false;
}

if(trailId == 8){
	$.detailwin.navBarHidden = '';
} 

//-----------------------------------------------------------
// Visar kartan
//-----------------------------------------------------------
function showMapDetail() {
	$.mapDetailView.add(showDetailMap(detailMap, trailId, trailName, trailColor));
}

//-----------------------------------------------------------
// Switch för att aktivera location-event för hotspots/sevärdheter
//-----------------------------------------------------------
$.geoSwitch1.addEventListener('change', function(e) {
	if ($.geoSwitch1.value == true) {
		getUserPos('hotspot');
		hotspotGPS = true;
	}
	if($.geoSwitch1.value == false){
		stopGPS();
		hotspotGPS = false;
	}
});

//-----------------------------------------------------------
// Switch för att visa användarens position på kartan
//-----------------------------------------------------------
$.posSwitch1.addEventListener('change', function(e) {
	if ($.posSwitch1.value == true) {
		getPosition(detailMap);
	} else {
		detailMap.userLocation = false;
	}
});

//-----------------------------------------------------------
// Eventlistener för klick på hotspot
//-----------------------------------------------------------
var evtLists = function(evt){
	try {
		if (evt.clicksource == 'rightButton') {
			showHotspot(evt.annotation.id);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartfunktioner");
	}	
};

detailMap.addEventListener('click', evtLists);
//-----------------------------------------------------------
// Funktioner för att visa och stänga kartmenyn 
//-----------------------------------------------------------
function showMenu() {
	try {
		if(!menuDetailVisible){
			showDetailMenu();
			menuDetailVisible = true;
		}else {
			closeDetailMenu();
			menuDetailVisible = false;
		}		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Detaljkartan");
	}
}
detailMap.addEventListener('singletap', function() {
	if(menuDetailVisible){
		closeDetailMenu();
		menuDetailVisible = false;
	}
});
function showDetailMenu(){
	$.widgetView.height = '90dp';
}
function closeDetailMenu(){
	$.widgetView.height = '0dp';
}

function closeMap(){
	$.detailwin.close();
}

 var cleanup = function() {
	$.destroy();
	$.off();
	$.detailwin = null;
	detailMap.removeEventListener('click', evtLists);
};

$.detailwin.addEventListener('close', cleanup);
