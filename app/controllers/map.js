Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");
Ti.include("SQL.js");

var args = arguments[0] || {};
var zoomedName = args.name;
var zoomColor = args.color;
var zoomLat = args.zoomlat;

var menuVisible = false;

//-----------------------------------------------------------
// Hämtar trailsCollection
//-----------------------------------------------------------
var trailsCollection = getTrailsCollection();

//-----------------------------------------------------------
// Onload-funktioner för kartan
//-----------------------------------------------------------
displayBigMap();
showMessageView();

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
		trailsCollection.fetch({
			query : query11 + myId + '"'
		});

		var jsonObjTr = trailsCollection.toJSON();

		var args = {
			id : jsonObjTr[0].id,
			title : myId,
			length : jsonObjTr[0].length,
			infoTxt : jsonObjTr[0].infoTxt,
			area : jsonObjTr[0].area,
			color : jsonObjTr[0].color,
			zoomlat : jsonObjTr[0].zoomLat,
			zoomlon : jsonObjTr[0].zoomLon
		};

		var trailDetail = Alloy.createController("trailDetail", args).getView();
		Alloy.CFG.tabs.activeTab.open(trailDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	}
}

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
map.addEventListener('click', function(evt) {
	if (evt.clicksource == 'rightButton') {
		if (evt.annotation.name == 'hotspot') {
			showHotspot(evt.annotation.id);
		} else if (evt.annotation.name == 'trail') {
			showTrail(evt.annotation.id);
		}
	}
});

//-----------------------------------------------------------
// Eventlistener för att stänga menyn vid klick på kartan
//-----------------------------------------------------------
map.addEventListener('singletap', function() {
	if(menuMapVisible){
		closeMenu();
		menuMapVisible = false; 
	}
});

//-----------------------------------------------------------
// Funktioner för att visa och stänga kartmenyn 
//-----------------------------------------------------------
function openMenu(){
	$.widgetView.height = '190dp';
}
Alloy.Globals.openMenu = openMenu;

function closeMenu(){
	$.widgetView.height = '0dp';
}
Alloy.Globals.closeMenu = closeMenu;



function showMessageView(){
	$.viewMessage.show();
	
	setTimeout(function(){
		$.viewMessage.hide({
			opacity : 0,
			duration : 500
		});
	}, 1000);
}


