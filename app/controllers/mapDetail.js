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
// Eventlistener för klick på hotspot
//-----------------------------------------------------------
// var eventListener = function() {};
// myView.addEventListener('click',  eventListener);
//  
// //now you can remove it
// myView.removeEventListener('click',  eventListener);

var evtList = function(evt){
Ti.API.info('evt list innan');
 if (evt.clicksource == 'rightButton' && lastClicked != evt.annotation.id) 
 		showHotspot(evt.annotation.id);
// 			
			 Ti.API.info('evt list efter');
// 
			// var hotspotCollection = Alloy.Collections.hotspotModel;
			// hotspotCollection.fetch({
				// query : query13 + evt.annotation.id + '"'
			// });
// 
			// var jsonHotspObj = hotspotCollection.toJSON();
// 
			// var hotspotTxt = {
				// title : evt.annotation.id,
				// infoTxt : jsonHotspObj[0].infoTxt,
				// id : jsonHotspObj[0].id
			// };
// 
			// if (hotspotDetail == null) {
				// hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
				// Alloy.CFG.tabs.activeTab.open(hotspotDetail);
				// Ti.API.info('create');
				// lastClicked = evt.annotation.id;
			// } 
			// else {
				// //Går aldrig in i open... därför aldrig hotspotDetail null?
				// Alloy.CFG.tabs.activeTab.open(hotspotDetail, hotspotTxt);
				// Ti.API.info('open');
			// }
// 
			// hotspotDetail.close();
			 hotspotDetail = null;
		};
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "Detaljkartan");
	// }




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
	$.widgetView.height = '110dp';
}
function closeDetailMenu(){
	$.widgetView.height = '0dp';
}



// BARA TEST, INGET FUNKAR TROR JAG

$.cleanup = function cleanup() {
	$.destroy();
	$.win = null;
	Ti.API.info('stäng mapdetail');
};

$.win.addEventListener('close', $.cleanup);
