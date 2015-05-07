Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};

//-----------------------------------------------------------
// args från annan controller
//-----------------------------------------------------------
var trailName = args.title;
var trailColor = args.color;
var trailId = args.id;

var trailsCollection = getTrailsCollection();

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
showMapDetail();
displaySpecificMarkers(trailId);
getSpecificIconsForTrail(trailId);
addEventList();


function showMapDetail(){
		$.mapDetailView.add(showDetailMap(trailId, trailName, trailColor));
}

//-----------------------------------------------------------
// Lägger till eventlistener för klick på hotspot
//-----------------------------------------------------------
function addEventList() {
	try {
		map.addEventListener('click', function(evt) {
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
		$.btnGetPosition.addEventListener('click', getZoomedMapPosition);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - addEventListener");
	}
}