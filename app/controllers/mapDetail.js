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

//-----------------------------------------------------------
// Hämtar trailsCollection
//-----------------------------------------------------------
var trailsCollection = getTrailsCollection();

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
showMapDetail();
displaySpecificMarkers(trailId, detailMap);
getSpecificIconsForTrail(trailId);

//-----------------------------------------------------------
// Visar kartan
//-----------------------------------------------------------
function showMapDetail() {
	$.mapDetailView.add(showDetailMap(detailMap, trailId, trailName, trailColor));
}

//-----------------------------------------------------------
// Eventlistener för klick på hotspot
//-----------------------------------------------------------
detailMap.addEventListener('click', function(evt) {
	
	Ti.API.info('evt list');
	
	try {
		if (evt.clicksource == 'rightButton') {
			var hotspotCollection = Alloy.Collections.hotspotModel;
			hotspotCollection.fetch({
				query : query13 + evt.annotation.id + '"'
			});

			var jsonHotspObj = hotspotCollection.toJSON();

			var hotspotTxt = {
				title : evt.annotation.id,
				infoTxt : jsonHotspObj[0].infoTxt,
				id : jsonHotspObj[0].id
			};

			if (hotspotDetail == null) {
				hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
				Alloy.CFG.tabs.activeTab.open(hotspotDetail);
				Ti.API.info('create');
			} else {
				Alloy.CFG.tabs.activeTab.open(hotspotDetail, hotspotTxt);
				Ti.API.info('open');
			}

			hotspotDetail.close();
			hotspotDetail = null;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Detaljkartan");
	}
});

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



// BARA TEST, INGET FUNKAR TROR JAG

$.cleanup = function cleanup() {
	$.destroy();
	$.win = null;
	Ti.API.info('stäng mapdetail');
};

$.win.addEventListener('close', $.cleanup);
