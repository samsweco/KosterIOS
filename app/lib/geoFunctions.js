var hotspotsNotVisible = true;
var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();

var infospotArray = [];
var menuVisible = false;
var mapMenuVisible = false;

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displayMarkers() {
	try {
		var markerHotspotArray = [];
		hotspotCollection.fetch();

		var markersJSON = hotspotCollection.toJSON();
		for (var u = 0; u < markersJSON.length; u++) {

			var markerHotspot = MapModule.createAnnotation({
				id : markersJSON[u].name,
				latitude : markersJSON[u].xkoord,
				longitude : markersJSON[u].ykoord,
				title : markersJSON[u].name,
				subtitle : 'Läs mer om ' + markersJSON[u].name + ' här!',
				image : '/images/hot-icon-azure.png',
				centerOffset : {
					x : -3,
					y : -16
				},
				rightButton : '/images/arrow.png',
				name : 'hotspot'
			});

			markerHotspotArray.push(markerHotspot);
		}

		return markerHotspotArray;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayMarkers");
	}
}