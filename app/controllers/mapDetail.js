Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};
var trailName = args.title;
var trailColor = args.color;
var trailId = args.id;
var zoomLat = args.zoomlat;
var zoomLon = args.zoomlon;

var showingPosition = false;
var menuDetailVisible = false;

detailMap.removeAllAnnotations();
showMapDetail();
getSpecificIconsForTrail(trailId, detailMap);
displaySpecificMarkers(trailId, detailMap);
	
//-----------------------------------------------------------
// Om man öppnar detaljvy för båtleden ska navBar'en synas
//-----------------------------------------------------------
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
// Switch för att visa användarens position på kartan
//-----------------------------------------------------------
function showUserPosition(){
	if (showingPosition == false) {
		getPosition(detailMap);
		showingPosition = true;
	} else {
		detailMap.userLocation = false;
		showingPosition = false;
	}
}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspotDetailMap(hotId) {		
	try {
		var jsonObjHot = returnSpecificHotspotsByName(hotId);

		var hotspotTxt = {
			title : jsonObjHot[0].name,
			infoTxt : jsonObjHot[0].infoTxt,
			id : jsonObjHot[0].id,
			x : jsonObjHot[0].xkoord,
			y : jsonObjHot[0].ykoord
		};

		var hotDet = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		$.mapNav.openWindow(hotDet);
		
		hotspotDetail = null;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!");
	}
}

//-----------------------------------------------------------
// Eventlistener för klick på hotspot
//-----------------------------------------------------------
var evtLists = function(evt){
	try {
		if (evt.clicksource == 'rightButton') {
			showHotspotDetailMap(evt.annotation.id);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartfunktioner");
	}	
};
detailMap.addEventListener('click', evtLists);

//-----------------------------------------------------------
// Funktion för att stänga och rensa sida när man stänger sidan
//-----------------------------------------------------------
 function closeMap(){
 	$.mapNav.close();
 }
 
 var cleanup = function() {
	$.destroy();
	$.off();
	$.detailwin = null;
	detailMap.removeEventListener('click', evtLists);
};

$.detailwin.addEventListener('close', cleanup);
