var snorkel = true;
var torrdass = true;
var utsiktsplats = true;
var wc = true;
var rastplats = true;
var taltplats = true;
var badplats = true;
var information = true;
var eldplats = true;
var menuVisible = false;

var infospotsNotVisible = true;
var hotspotsNotVisible = true;

//var MapModule = require('ti.map');
var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();

//-----------------------------------------------------------
// Visar markers för vandringslederna
//-----------------------------------------------------------
function displayTrailMarkers() {
	try {
		trailsCollection.fetch({
			query : 'SELECT name, pinLon, pinLat, color FROM trailsModel'
		});

		var jsonObj = trailsCollection.toJSON();
		for (var i = 0; i < jsonObj.length; i++) {
			var markerAnnotation = MapModule.createAnnotation({
				id : jsonObj[i].name,
				latitude : jsonObj[i].pinLat,
				longitude : jsonObj[i].pinLon,
				title : jsonObj[i].name,
				subtitle : 'Läs mer om ' + jsonObj[i].name + ' här!',
				pincolor : MapModule.ANNOTATION_GREEN,
				rightButton : '/images/arrow.png',
				name : 'trail'
			});

			baseMap.addAnnotation(markerAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayTrailMarkers");
	}
}

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displayMarkers() {
	try {
		var markerArray = [];
		hotspotCollection.fetch();

		var markersJSON = hotspotCollection.toJSON();
		for (var u = 0; u < markersJSON.length; u++) {

			if (OS_IOS) {
				var marker = MapModule.createAnnotation({
					id : markersJSON[u].name,
					latitude : markersJSON[u].xkoord,
					longitude : markersJSON[u].ykoord,
					title : markersJSON[u].name,
					subtitle : 'Läs mer om ' + markersJSON[u].name + ' här!',
					pincolor : MapModule.ANNOTATION_PURPLE,
					rightButton : '/images/arrow.png',
					name : 'hotspot'
				});
			}

			markerArray.push(marker);
		}

		baseMap.addAnnotations(markerArray);
		hotspotsNotVisible = false;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayMarkers");
	}
}

//-----------------------------------------------------------
// Visar ikoner för alla informationsobjekt
//-----------------------------------------------------------
function displayInfoSpots(type) {
	try {
		var markerArray = [];
		var infospotCollection = getInfospotCollection();
		infospotCollection.fetch({
			query : 'select infospotModel.name, infospotModel.icon, infospotCoordinatesModel.latitude, infospotCoordinatesModel.longitude from infospotCoordinatesModel join infospotModel on infospotCoordinatesModel.infospotID = infospotModel.id WHERE infospotModel.name ="' + type + '"'
		});

		var infoJSON = infospotCollection.toJSON();
		for (var u = 0; u < infoJSON.length; u++) {
			var marker = MapModule.createAnnotation({
				latitude : infoJSON[u].latitude,
				longitude : infoJSON[u].longitude,
				image : '/images/map_' + infoJSON[u].icon
			});

			markerArray.push(marker);
		}

		return markerArray;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayInfoSpots");
	}
}

function removeAnnotations() {
	baseMap.removeAllAnnotations();
}

function normalMap() {
	baseMap.mapType = MapModule.NORMAL_TYPE;
}

function hybridMap() {
	baseMap.mapType = MapModule.HYBRID_TYPE;
}

function satelliteMap() {
	baseMap.mapType = MapModule.SATELLITE_TYPE;
}

function showHotspots() {
	if (hotspotsNotVisible) {
		displayMarkers();
		hotspotsNotVisible = false;
	}
}

function showWC() {
	baseMap.addAnnotations(displayInfoSpots("wc"));
}

function showEldplats() {
	baseMap.addAnnotations(displayInfoSpots("eldplats"));
}

function showSnorkelled() {
	baseMap.addAnnotations(displayInfoSpots("snorkelled"));
}

function showInformation() {
	baseMap.addAnnotations(displayInfoSpots("information"));
}

function showBadplats() {
	baseMap.addAnnotations(displayInfoSpots("badplats"));
}

function showRastplats() {
	baseMap.addAnnotations(displayInfoSpots("rastplats"));
}

function showTaltplats() {
	baseMap.addAnnotations(displayInfoSpots("taltplats"));
}

function showUtkiksplats() {
	baseMap.addAnnotations(displayInfoSpots("utsiktsplats"));
}

function showTorrdass() {
	baseMap.addAnnotations(displayInfoSpots("torrdass"));
}

function showMenuWidget(){
	if(!menuVisible){
		$.mapmenu.show();
		menuVisible = true;
	}
	else{
		$.mapmenu.hide();
		menuVisible = false;
	}
};

Alloy.Globals.showMenuWidget = showMenuWidget;
