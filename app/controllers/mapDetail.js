Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");
Ti.include("SQL.js");

var args = arguments[0] || {};
var trailName = args.title;
var trailColor = args.color;
var trailId = args.id;
var zoomLat = args.zoomlat;
var zoomLon = args.zoomlon;

var menuDetailVisible = false;
var hotspotDetail = null;

var lastClicked = null;

//-----------------------------------------------------------
// Hämtar trailsCollection
//-----------------------------------------------------------
var trailsCollection = getTrailsCollection();

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
detailMap.removeAllAnnotations();
showMapDetail();
getSpecificIconsForTrail(trailId);

//-----------------------------------------------------------
// Visar kartan
//-----------------------------------------------------------
function showMapDetail() {
	$.mapDetailView.add(showDetailMap(detailMap, trailId, trailName, trailColor));
	Ti.API.info("show map detail");
}


//-----------------------------------------------------------
// Switch för att aktivera location-event för hotspots/sevärdheter
//-----------------------------------------------------------
$.geoSwitch1.addEventListener('change', function(e) {
	if ($.geoSwitch1.value == true) {
		getUserPos('hotspot');
	}
	if($.geoSwitch1.value == false){
		stopGPS();
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
// Switch för att visa hotspots på kartan
//-----------------------------------------------------------
function disHot(){
	if ($.HotSwitch1.value == true) {
		removeSpecHotspot();
		displaySpecificMarkers(trailId, detailMap);
		detailMap.addEventListener('click', evtList);	
	} else {
		detailMap.removeEventListener('click', evtList);
		removeSpecHotspot();
	}
}



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
	$.widgetView.height = '117dp';
}
function closeDetailMenu(){
	$.widgetView.height = '0dp';
}



// BARA TEST, INGET FUNKAR TROR JAG

 var cleanup = function() {
	$.destroy();
	$.off();
	$.detailwin = null;
	Ti.API.info('stäng mapdetail');
	detailMap.removeEventListener('click', evtList);
};

$.detailwin.addEventListener('close', cleanup);
