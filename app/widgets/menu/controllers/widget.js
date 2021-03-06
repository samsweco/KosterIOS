Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");
Ti.include("/collectionData.js");

var mainMenuOpen = false;

//-----------------------------------------------------------
// Metoder för navigeringen
//-----------------------------------------------------------

function navigate(e) {
	switch 	(e.rowData.id) {
		case "home_row" : {
			//Navigera till Index
			var home = Alloy.createController('index').getView().open();
			break;
		}
		case "hotspots_row" : {
			//Navigera till Sevärdheter
			var hotspots = Alloy.createController('hotspots').getView().open();
			break;
		}
		case "trails_row" : {
			//Navigera till Vandringsleder
			var trails = Alloy.createController('trails').getView().open();
			break;
		}
		case "map_row" : {
			//Navigera till Karta
			var mapView = Alloy.createController('map').getView().open();
			break;
		}
		case "info_row" : {
			//Navigera till Information
			var info = Alloy.createController('infoList').getView().open();
			break;
		}
		case "interactive_row" : {
			//Navigera till Bokstavsjakten
			var interactive = Alloy.createController('interactive').getView().open();
			break;
		}
		case "boat_row" : {
			//Navigera till Båtresan
		 	var args = {
				id : 8,
				title : 'Båtresan',
				titleEng : 'The boat trip',
				length : 10,
				infoTxt : 'Välkommen på båtturen mellan Strömstad och Koster. Turen är cirka 10 km lång och tar mellan 30 och 60 minuter. Under resan kommer du få lite information om Kosterhavet och livet där.',
				infoTxtEng : 'Join us on a boat trip between Strömstad and Koster. It is about 10 km and takes between 30 and 60 minutes. During the trip you will get a little information about Kosterhavet and what is living there.',
				area : 'Strömstad-Koster',
				zoomlat : '58.936458',
				zoomlon : '11.172279',
				color : 'boat'
			};
			  
		 	var trailDetail = Alloy.createController("trailDetail", args).getView().open();
			break;
		}
		case "newsfeed_row" : {
			//Navigera till Instagramflöde
			var newsfeed = Alloy.createController('newsfeed').getView().open();
			break;
		}
	}
}

//-----------------------------------------------------------
// Öppnar och stänger menyn
//-----------------------------------------------------------
function openMainMenu() {
	if (!mainMenuOpen) {
		$.menuContainerView.height = '61%';
		mainMenuOpen = true;
		
		$.lbl_menu_close.visible = true;
		$.lbl_menu_close.height = '35dp';
		$.lbl_menu_open.height = '0dp';	
		$.lbl_menu_open.visible = false;	
	} else {
		closeMainMenu();
	}
}

function closeMainMenu() {
	if(mainMenuOpen){
		$.menuContainerView.height = '35dp';
		$.lbl_menu_close.visible = false;
		$.lbl_menu_close.height = '0dp';
		$.lbl_menu_open.height = '35dp';	
		$.lbl_menu_open.visible = true;	
		
		mainMenuOpen = false;
	}	
}

//-----------------------------------------------------------
// Startar och avslutar location-event för hotspots/sevärdheter
//-----------------------------------------------------------
$.geoSwitchHotspot.addEventListener('change', function(e) {
	if ($.geoSwitchHotspot.value == true) {
		Alloy.Globals.getUserPos('hotspot');
		hotspotGPS = true;
	}
	if($.geoSwitchHotspot.value == false){
		Alloy.Globals.stopGPS();
		hotspotGPS = false;
	}
});

$.geoSwitchBoat.addEventListener('change', function() {
	if ($.geoSwitchBoat.value == true) {
		getUserPos('boat');
		boatGPS = true;
	} else {
		Alloy.Globals.stopBoatGPS();
		boatGPS = false;
	}
});

//-----------------------------------------------------------
// Kontrollerar om man redan slagit på GPS och ändrar 
// switch'arna till true 
//-----------------------------------------------------------
if(hotspotGPS){
	$.geoSwitchHotspot.value = true;
} else {
	$.geoSwitchHotspot.value = false;
}

if(boatGPS){
	$.geoSwitchBoat.value = true;
} else {
	$.geoSwitchBoat.value = false;
}