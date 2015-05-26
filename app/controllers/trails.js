var args = arguments[0] || {};

//-----------------------------------------------------------
// Hämtar trailsCollection
//-----------------------------------------------------------
try {
	var trailsCollection = getTrailsCollection();
	trailsCollection.fetch();
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "trails - create trailsCollection");
}

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
setRowData();

//-----------------------------------------------------------
// Läser in data till alla listitems
//-----------------------------------------------------------
function setRowData() {
	try {
		var trailsCollection = Alloy.Collections.trailsModel;
		trailsCollection.fetch();

		var tableViewData = [];
		var rows = trailsCollection.toJSON();

		for (var i = 0; i < rows.length; i++) {
			if(rows[i].id != 8){
			var row = Ti.UI.createTableViewRow({
				layout : 'horizontal',
				id : rows[i].id,
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
				image : '/pics/' + rows[i].cover_img,
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
				text : rows[i].name
			});

			var lblDistance = Ti.UI.createLabel({
				left : '5dp',
				top : '0dp',
				font : {
					fontSize : '12dp',
					fontFamily : 'Raleway-Light'
				},
				text : 'Sträcka : ' + rows[i].length + " km"
			});

			var lblArea = Ti.UI.createLabel({
				left : '5dp',
				top : '0dp',
				font : {
					fontSize : '12dp',
					fontFamily : 'Raleway-Light'
				},
				text : rows[i].area
			});

			var iconView = showIcons(rows[i].id);

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

		var trailsCollection = Alloy.Collections.trailsModel;
		trailsCollection.fetch({
			query : query18 + id + '"'
		});

		var jsonObj = trailsCollection.toJSON();

		var args = {
			id : id,
			title : jsonObj[0].name,
			length : jsonObj[0].length,
			infoTxt : jsonObj[0].infoTxt,
			area : jsonObj[0].area,
			zoomlat : jsonObj[0].zoomLat,
			zoomlon : jsonObj[0].zoomLon,
			color : jsonObj[0].color,
			jsonfile : jsonObj[0].JSONfile
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
		var trail_id = id;
		var selectedIcons = getIcons(trail_id);

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
// Hämtar ikoner för varje vandringsled
//-----------------------------------------------------------
function getIcons(trail_id) {
	try {
		var id = trail_id;

		var infotrailCollection = Alloy.Collections.infospotCoordinatesModel;
		infotrailCollection.fetch({
			query : query19 + id + '"'
		});

		var infoTrails = infotrailCollection.toJSON();

		return infoTrails;

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
