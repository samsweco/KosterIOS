Ti.include("collectionData.js");

var args = arguments[0] || {};

setRowData();

//-----------------------------------------------------------
// Sätter label med rätt font som windowtitle
//-----------------------------------------------------------
var windowTitle = Ti.UI.createLabel({
	text: String.format(L('hotspot_row'), ''),
	font: {
		fontSize: '17dp',
		fontFamily: 'Raleway-Medium'
	}
});
$.hotspotWindow.titleControl = windowTitle;

//-----------------------------------------------------------
// Sorterar sevärdheterna i bokstavsordning
//-----------------------------------------------------------
function sortByName(a, b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

//-----------------------------------------------------------
// Läser in data till alla listitems
//-----------------------------------------------------------
function setRowData() {
	try {
		var tableViewData = [];
		var hotspotRows = returnHotspots();
		
		hotspotRows.sort(sortByName);

		for (var i = 0; i < hotspotRows.length; i++) {
			if (hotspotRows[i].id != 8 && hotspotRows[i].id != 32) {
				var row = Ti.UI.createTableViewRow({
					layout : 'horizontal',
					id : hotspotRows[i].name,
					height : '90dp',
					top : '0dp',
					hasChild : true
				});

				var listItem = Ti.UI.createView({
					layout : 'vertical',
					height : Ti.UI.SIZE,
					width : Ti.UI.FILL,
				});

				var img = Ti.UI.createImageView({
					height : '70dp',
					width : '115dp',
					image : '/images/' + hotspotRows[i].cover_pic,
					left : '5dp',
					top : '10dp'
				});

				var labelView = Ti.UI.createView({
					height : Ti.UI.SIZE,
					width : Ti.UI.FILL,
					backgroundColor : 'white',
					layout : 'vertical'
				});

				var lblName = Ti.UI.createLabel({
					color : '#FCAF17',
					left : '5dp',
					font : {
						fontSize : '14dp',
						fontFamily : 'Raleway-Medium'
					}
					// text : hotspotRows[i].name
				});
				
				if(language == 'svenska'){
					lblName.text = hotspotRows[i].name;
				} else {
					lblName.text = hotspotRows[i].engelsk_titel;
				}

				labelView.add(lblName);

				row.add(img);
				row.add(labelView);

				tableViewData.push(row);
			}
		}
		$.hotspotTable.data = tableViewData;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsleder");
	}
}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspotDetailView(e) {		
	try {
		var jsonObjHot = returnSpecificHotspotsByName(e.rowData.id);
		var hotspotId;
		var x;
		var y;
		
		if(jsonObjHot[0].id == 32){
			hotspotId = 42;
			x = 58.893085;
			y = 11.047972;
		} else {
			hotspotId = jsonObjHot[0].id;
			x = jsonObjHot[0].xkoord;
			y = jsonObjHot[0].ykoord;
		}

		var hotspotTxt = {
			title : jsonObjHot[0].name,
			titleEng : jsonObjHot[0].engelsk_titel,
			infoTxt : jsonObjHot[0].infoTxt,
			infoTxtEng : jsonObjHot[0].engelsk_beskrivning,
			id : hotspotId,
			x : x,
			y : y
		};

		var hotDet = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		$.hotspotNav.openWindow(hotDet);
		
		hotspotDetail = null;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!");
	}
}

//-----------------------------------------------------------
// Funktioner för att stänga sidan helt när man öppnar en annan
//-----------------------------------------------------------
function closeHotWindow(){
	$.hotspotWindow.close();
}

//-----------------------------------------------------------
// Kastar model
//-----------------------------------------------------------
function destroyModel() {
	$.destroy();
}
