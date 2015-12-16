Ti.include("mapFunctions.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};

try {
	$.lblTrailName.text = args.title || 'Default Name';
	$.lblTrailLength.text = args.length + " kilometer" || 'Default Length';
	$.lblTrailArea.text = args.area || 'Default Color';
	$.lblTrailInfo.text = args.infoTxt || 'Default infoText';

	var trailId = args.id;
	globalTrailID = trailId;
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "trailDetail - set labels");
}

if(args.title == 'Äventyrsslingan'){
	$.btnSendTo.show();
	$.btnSendTo.height = '20dp';
	$.btnSendTo.title = 'Gå till bokstavsjakten!';
	$.hikeDetailWin.navBarHidden = 'true';
	
	$.btnSendTo.addEventListener('click', function(){
		// Alloy.CFG.tabs.setActiveTab(3);
		var sendToInteractive = Alloy.createController("interactive").getView().open();
	});
} else if(args.title == 'Båtresan'){
	$.boatSwitch.show();
	$.boatSwitch.height = '30dp';
	$.lblBoat.show();
	$.lblBoat.height = '30dp';
	
	$.hikeDetailWin.title = 'Båtresan';
	$.trailDetailNav.navbarHidden = 'true';
} else {
	$.trailDetailNav.navBarHidden = 'true';
}

$.boatSwitch.addEventListener('change', function() {
	if ($.boatSwitch.value == true) {
		getUserPos('boat');
		boatGPS = true;
	} else {
		Alloy.Globals.stopBoatGPS();
		boatGPS = false;
	}
});

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
selectTrailPics();
LoadHotspotList();
showIcons();
changeLabel();

//-----------------------------------------------------------
// Hämtar info för den vandringsled som ska öppnas i detaljvy
//-----------------------------------------------------------
function zoomMapTrail() {
	try {
		var trail = {
			id : args.id,
			title : args.title,
			color : args.color,
			zoomlat : args.zoomlat,
			zoomlon : args.zoomlon
		};
		
		var mapDetail = Alloy.createController("mapDetail", trail).getView();
		$.trailDetailNav.openWindow(mapDetail);
		cleanup();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsled - zoomMapTrail");
	}	
}

//-----------------------------------------------------------
// Hämtar bilder till bildspel för den valda vandringsleder
//-----------------------------------------------------------
function selectTrailPics() {
	try {
		var mediaObjJSON = returnSpecificTrailPics(trailId);
		
		for (var i = 0; i < mediaObjJSON.length; i++) {
			var img_view = Ti.UI.createImageView({
				image : '/images/'+ mediaObjJSON[i].filename +'.png',
			//	url: '/images/' + mediaObjJSON[i].filename,
				height : '200dp',
				width : '300dp',
				top : '0dp'
			});
			
			//Titanium.API.info(img_view.image);

			var lblImgTxt = Ti.UI.createLabel({
				left : '3dp',
				top : '0.5dp',
				text : mediaObjJSON[i].img_txt,
				color : 'white',
				font : {
					fontSize : 12,
					fontStyle : 'italic',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					fontFamily: 'Raleway-Medium'
				}
			});

			var backgroundView = Ti.UI.createView({
				layout : 'vertical',
				backgroundColor : 'black',
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE
			});

			backgroundView.add(img_view);
			backgroundView.add(lblImgTxt);

			$.slideShowTrails.addView(backgroundView);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsled-selectTrailPics");
	}
}

//-----------------------------------------------------------
// Visar hotspots för en vald vandringsled
//-----------------------------------------------------------
function LoadHotspotList() {
	try {
		var tableViewData = [];
		var tableRow = returnSpecificHotspotsByTrailId(trailId);

		for (var i = 0; i < tableRow.length; i++) {
			var row = Ti.UI.createTableViewRow({
				id : tableRow[i].name,
				layout : 'horizontal',
				height : '90dp',
				top : '0dp',
				hasChild : true
			});

			var img = Ti.UI.createImageView({
				height : '70dp',
				width : '115dp',
				image : '/images/' + tableRow[i].cover_pic,
				left : '15dp',
				top : '10dp'
			});

			var labelView = Ti.UI.createView({
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL,
				backgroundColor : 'white',
				layout : 'vertical'
			});

			var lblName = Ti.UI.createLabel({
				color: '#FCAF17',
				left : '5dp',
				font : {
					fontSize : '14dp',
					fontFamily: 'Raleway-Medium'
				},
				text : tableRow[i].name
			});

			labelView.add(lblName);

			row.add(img);
			row.add(labelView);

			tableViewData.push(row);
		}

		$.hotspotTable.data = tableViewData;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsled-LoadHotspotList");
	}
}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspotDetail(e) {		
	try {
		var jsonObjHot = returnSpecificHotspotsByName(e.rowData.id);

		var hotspotTxt = {
			title : jsonObjHot[0].name,
			infoTxt : jsonObjHot[0].infoTxt,
			id : jsonObjHot[0].id
		};

		var hotDet = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		$.trailDetailNav.openWindow(hotDet);
		
		hotspotDetail = null;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!");
	}
}

//-----------------------------------------------------------
// Sätter ut ikoner i kartvyn.
//-----------------------------------------------------------
function showIcons() {
	try {
		var selectedIcons = returnSpecificIconsByTrailId(trailId);

		for (var i = 0; i < selectedIcons.length; i++) {
			var covericon = Ti.UI.createImageView({
				height : '25dp',
				width : '25dp',
				left : '2dp',
				top : '10dp',
				image : '/images/' + selectedIcons[i].name +'.png'
			});

			$.iconrow.add(covericon);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsled-showIcons");
	}
}

//-----------------------------------------------------------
// Sätter text i en label utefter vilken led som visas
//-----------------------------------------------------------
function changeLabel(){
	try {
		if (args.title != 'Båtleden') {
			$.lblLangsVagen.text = 'Det här kan du se längs vägen:';
		} else {
			$.lblLangsVagen.text = 'Det här kan du läsa om på båtresan:';
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsled");
	}
}
 
function closeWindow(){
	$.trailDetailNav.close();
}

 var cleanup = function() {
	$.destroy();
	$.off();
	$.hikeDetailWin = null;
};

$.hikeDetailWin.addEventListener('close', cleanup);
