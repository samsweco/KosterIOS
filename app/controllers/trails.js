Ti.include("collectionData.js");

var args = arguments[0] || {};

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
setRowData();

//-----------------------------------------------------------
// Läser in data till alla listitems
//-----------------------------------------------------------
function setRowData() {
	try {
		var tableViewData = [];
		var trailRows = returnTrails();

		for (var i = 0; i < trailRows.length; i++) {
			if (trailRows[i].id != 8) {
				var row = Ti.UI.createTableViewRow({
					layout : 'horizontal',
					id : trailRows[i].id,
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
					image : '/images/' + trailRows[i].cover_img,
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
					},
					text : trailRows[i].name
				});

				var lblDistance = Ti.UI.createLabel({
					left : '5dp',
					top : '0dp',
					font : {
						fontSize : '11dp',
						fontFamily : 'Raleway-Light'
					},
					text : 'Sträcka : ' + trailRows[i].length + " km"
				});

				var lblArea = Ti.UI.createLabel({
					left : '5dp',
					top : '0dp',
					font : {
						fontSize : '11dp',
						fontFamily : 'Raleway-Light'
					},
					text : trailRows[i].area
				});

				var iconView = showIcons(trailRows[i].id);

				labelView.add(iconView);
				labelView.add(lblName);
				labelView.add(lblDistance);
				labelView.add(lblArea);

				row.add(img);
				row.add(labelView);

				tableViewData.push(row);
			}
		}
		$.table.data = tableViewData;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsleder");
	}
}

//-----------------------------------------------------------
// Öppnar trail detail med args för den valda leden
//-----------------------------------------------------------
function showTrailDetails(e) {
	try {
		var id = e.rowData.id;
		var trailJsonObj = returnSpecificTrailById(id);

		var args = {
			id : id,
			title : trailJsonObj[0].name,
			length : trailJsonObj[0].length,
			infoTxt : trailJsonObj[0].infoTxt,
			area : trailJsonObj[0].area,
			zoomlat : trailJsonObj[0].zoomLat,
			zoomlon : trailJsonObj[0].zoomLon,
			color : trailJsonObj[0].color,
			jsonfile : trailJsonObj[0].JSONfile
		};

		var trailDetail = Alloy.createController("trailDetail", args).getView();
		Alloy.CFG.tabs.activeTab.open(trailDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsleder");
	}
}

//-----------------------------------------------------------
// Sätter ikoner för varje vandringsled
//-----------------------------------------------------------
function showIcons(id) {
	try {
		var selectedIcons = returnSpecificIconsByTrailId(id);

		var iconView = Ti.UI.createView({
			layout : 'horizontal',
			height : '22dp',
			width : Ti.UI.FILL,
			backgroundColor : 'white',
			left : '5dp',
			top : '10dp'
		});

		for (var i = 0; i < selectedIcons.length; i++) {
			var iconImgView = Ti.UI.createImageView({
				height : '20dp',
				width : '20dp',
				left : '0dp'
			});

			iconImgView.image = '/images/' + selectedIcons[i].name + '.png';
			iconView.add(iconImgView);
		}

		return iconView;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsleder");
	}
}

//-----------------------------------------------------------
// Kastar model
//-----------------------------------------------------------
function destroyModel() {
	$.destroy();
}
