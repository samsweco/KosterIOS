Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};

//-----------------------------------------------------------
// args från annan controller
//-----------------------------------------------------------
var trailName = args.title;
var trailColor = args.color;
var trailId = args.id;
var zoomLat = args.zoomlat;
var zoomLon = args.zoomlon;

var trailsCollection = getTrailsCollection();

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
showMapDetail();
displaySpecificMarkers(trailId, detailMap);
getSpecificIconsForTrail(trailId);
addEventList();


function showMapDetail(){
	$.mapDetailView.add(showDetailMap(detailMap, trailId, trailName, trailColor));
}

//-----------------------------------------------------------
// Lägger till eventlistener för klick på hotspot
//-----------------------------------------------------------
function addEventList() {
	try {
		detailMap.addEventListener('click', function(evt) {
			if (evt.annotation.name == 'hotspot') {
				if (evt.clicksource == 'rightButton') {
					var hotspotCollection = Alloy.Collections.hotspotModel;
					hotspotCollection.fetch({
						query : 'SELECT id, infoTxt from hotspotModel where name = "' + evt.annotation.id + '"'
					});

					var jsonHotspObj = hotspotCollection.toJSON();

					var hotspotTxt = {
						title : evt.annotation.id,
						infoTxt : jsonHotsObj[0].infoTxt,
						id : jsonHotsObj[0].id
					};

					var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
					Alloy.CFG.tabs.activeTab.open(hotspotDetail);
				};
			}
		});
		

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - addEventListener");
	}
}

function getZoomedMapPosition() {
	if (myPosition == false) {
		getPosition(detailMap);
		myPosition = true;
	} else {
		detailMap.region = {
			latitude : zoomLat,
			longitude : zoomLon,
			latitudeDelta : 0.03,
			longitudeDelta : 0.03
		};	
		detailMap.animate = true;
		detailMap.userLocation = false;
		myPosition = false;
	}
}