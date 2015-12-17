Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");
Ti.include("/collectionData.js");

//-----------------------------------------------------------
// Metoder för navigeringen
//-----------------------------------------------------------

function navigate(e) {
		switch 	(e.rowData.id) {
			// case sv_row : {
				// //Svenskt språk
				// break;
			// }
			// case eng_row : {
				// //Engelskt språk
				// break;
			// }
			case "home_row" : {
				//Navigera till Index
				var home = Alloy.createController('index').getView().open();
				break;
			}
			// 			
			// case hotspots_row : {
				// break;
			// }
			
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
				 length : 10,
				 infoTxt : 'Välkommen på båtturen mellan Strömstad och Koster. Turen är cirka 10 km lång och tar mellan 30 och 60 minuter. Under resan kommer du få lite information om Kosterhavet och livet där.',
				 area : 'Strömstad-Koster',
				 zoomlat : '58.936458',
				 zoomlon : '11.172279',
				 color : 'boat'
				 };
				  
			 	var trailDetail = Alloy.createController("trailDetail", args).getView().open();
				break;
			}
			// case show_hot_row : {
				// //Visa sevärdheter på kartan
				// break;
			// }
			// case notification_row : {
				// //Påminnelse i närheten av sevärdheter
				// break;
			// }
}
}


var mainMenuOpen = false;

function openMainMenu() {
	if (!mainMenuOpen) {
		$.menuContainerView.height = '60%';
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