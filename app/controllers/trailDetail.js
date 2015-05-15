Ti.include("SQL.js");
var args = arguments[0] || {};

//-----------------------------------------------------------
// Args från trails - klick på item i listan
//-----------------------------------------------------------
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

//-----------------------------------------------------------
// hämtar info för den vandringsled som ska öppnas i detaljvy
//-----------------------------------------------------------
function zoomMapTrail() {
	var trail = {
		id : args.id,
		title : args.title,
		color : args.color,
		zoomlat : args.zoomlat,
		zoomlon : args.zoomlon
	};
	var mapDetail = Alloy.createController("mapDetail", trail).getView();
	Alloy.CFG.tabs.activeTab.open(mapDetail);
}

selectTrailPics();
showHotspots();
showIcons();

//-----------------------------------------------------------
// Hämtar bilder till bildspel för den valda vandringsleder
//-----------------------------------------------------------
function selectTrailPics() {
	try {
		var mediaCollection = Alloy.Collections.mediaModel;
		mediaCollection.fetch({
			query : query14 + trailId + '"'
		});

		var jsonMedia = mediaCollection.toJSON();
		for (var i = 0; i < jsonMedia.length; i++) {

			var img_view = Ti.UI.createView({
				backgroundImage : "/pics/" + jsonMedia[i].filename,
				height : '200dp',
				width : '300dp',
				top : '0dp'
			});

			var lblImgTxt = Ti.UI.createLabel({
				left : '3dp',
				top : '0.5dp',
				text : jsonMedia[i].img_txt,
				color : 'white',
				font : {
					fontSize : 12,
					fontStyle : 'italic',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					fontFamily: 'Raleway-Medium'
				},

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
			//$.slideShowHotspotDetail.add(lblImgTxt);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "trailDetail - selectTrailPics");
	}

}

//-----------------------------------------------------------
// Visar hotspots för en vald vandringsled
//-----------------------------------------------------------
function showHotspots() {
	try {
		var tableViewData = [];
		var rows = getHotspotData();

		for (var i = 0; i < rows.length; i++) {
			var row = Ti.UI.createTableViewRow({
				id : rows[i].name,
				layout : 'horizontal',
				height : '90dp',
				top : '0dp',
				hasChild : true
			});

			var img = Ti.UI.createImageView({
				height : '70dp',
				width : '115dp',
				image : '/pics/' + rows[i].cover_pic,
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
				//color : '#FCAF17',
				color: '#FCAF17',
				left : '5dp',
				font : {
					fontSize : '14dp',
					fontFamily: 'Raleway-Medium'
				},
				text : rows[i].name
			});

			labelView.add(lblName);

			row.add(img);
			row.add(labelView);

			tableViewData.push(row);
		}

		$.hotspotTable.data = tableViewData;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "trailDetail - showHotspots");
	}
}

//-----------------------------------------------------------
// Hämtar data för hotspots som hör till den valda vandringsleden
//-----------------------------------------------------------
function getHotspotData() {
	try {
		var id = trailId;

		var hotstrailCollection = Alloy.Collections.hotspotModel;
		hotstrailCollection.fetch({
			query : query15 + id + '"'
		});

		var jsonObj = hotstrailCollection.toJSON();
		return jsonObj;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "trailDetail - getHotspotData");
	}
}

//-----------------------------------------------------------
// Öppnar detaljvy med vald hotspot - klickad på i kartvyn
//-----------------------------------------------------------
function showHotspot(e) {
	try {
		var name = e.rowData.id;

		var hotspotCollection = Alloy.Collections.hotspotModel;
		hotspotCollection.fetch({
			query : query16 + name + '"'
		});

		var jsonObj = hotspotCollection.toJSON();
		var txt = jsonObj[0].infoTxt;
		var idnr = jsonObj[0].id;

		var hotspotTxt = {
			title : name,
			infoTxt : txt,
			id : idnr
		};

		var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		Alloy.CFG.tabs.activeTab.open(hotspotDetail);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "trailDetail - showHotspot");
	}
}

//-----------------------------------------------------------
// Sätter ut ikoner i kartvyn.
//-----------------------------------------------------------
function showIcons() {
	try {
		var selectedIcons = getIcons();

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
		newError("Något gick fel när sidan skulle laddas, prova igen!", "trailDetail - showIcons");
	}
}

//-----------------------------------------------------------
// Hämtar ikoner till vald vandringsled
//-----------------------------------------------------------
function getIcons() {
	try {
		var id = trailId;

		var infotrailCollection = Alloy.Collections.infospotCoordinatesModel;
		infotrailCollection.fetch({
			query : query17 + id + '"'
		});

		var infoTrails = infotrailCollection.toJSON();
		return infoTrails;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "trailDetail - getIcons");
	}
}

