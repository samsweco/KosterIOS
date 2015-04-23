var args = arguments[0] || {};

try {
	var trailsCollection = Alloy.Collections.trailsModel;
	trailsCollection.fetch();
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "trails - create trailsCollection");
}

setRowData();

//-----------------------------------------------------------
// Läser in data till alla listitems
//-----------------------------------------------------------
function setRowData() {

		var trailsCollection = Alloy.Collections.trailsModel;
		trailsCollection.fetch();

		var tableViewData = [];
		var rows = trailsCollection.toJSON();
		
		for(var i = 0; i<rows.length; i++){
			
				var row = Ti.UI.createTableViewRow({
				layout : 'horizontal',
				id : i + 1,
				height : '80dp',
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
				width : '110dp',
				image : "/pics/" + rows[i].cover_img,
				left : '5dp',
				top : '5dp'
			});
			
			var labelView = Ti.UI.createView({
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL,
				backgroundColor : 'white',
				layout : 'vertical'
			});

			
			var lblName = Ti.UI.createLabel({
				color : '#FF9966',
				left : '5dp',
				font : {
					fontSize : 13,
					fontWeight : 'bold',
					fontFamily: 'Raleway-Medium'
				},
				text : rows[i].name
			});
			
			var lblDistance = Ti.UI.createLabel({
				left : '5dp',
				top : '0dp',
				font : {
					fontSize : 10,
					fontFamily: 'Raleway-Light'
				},
				text : 'Sträcka : ' + rows[i].length + " km"
			});
			
			var lblArea = Ti.UI.createLabel({
				left : '5dp',
				top : '0dp',
				font : {
					fontSize : 10,
					fontFamily: 'Raleway-Light'
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
	$.table.data = tableViewData;
}

//-----------------------------------------------------------
// Öppnar trail detail med args för den valda leden
//-----------------------------------------------------------
function showTrailDetails(e) {

	 try {
		var id = e.rowData.id;
		
		var trailsCollection = Alloy.Collections.trailsModel;
		trailsCollection.fetch({
			query : 'SELECT * FROM trailsModel where id ="' + id + '"'
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
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Trails - showTrailDetails");
	}
}

//-----------------------------------------------------------
// Sätter ikoner för varje vandringsled
//-----------------------------------------------------------
function showIcons(id) {
	var trail_id = id;
	var selectedIcons = getIcons(trail_id);

	var iconView = Ti.UI.createView({
		layout : 'horizontal',
		height : '25dp',
		width : '125dp',
		backgroundColor : 'white',
		left : '5dp',
		top : '5dp'

	});

	for (var i = 0; i < selectedIcons.length; i++) {

		var iconImgView = Ti.UI.createImageView({
			height : '25dp',
			width : '25dp',
			left : '0dp'
		});

			iconImgView.image = '/images/' + selectedIcons[i].icon;

		iconView.add(iconImgView);
	}
	return iconView;
}

//-----------------------------------------------------------
// Hämtar ikoner för varje vandringsled
//-----------------------------------------------------------
function getIcons(trail_id) {
	try {
		var id = trail_id;

		var infotrailCollection = Alloy.Collections.infospotModel;
		infotrailCollection.fetch({
			query : 'SELECT icon from infospotModel join infospot_trailsModel on infospot_trailsModel.infospotID = infospotModel.id where trailsID ="' + id + '"'
		});

		var infoTrails = infotrailCollection.toJSON();

		return infoTrails;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "trailDetail - getIcons");
	}

}

function destroyModel() {
	$.destroy();
}
