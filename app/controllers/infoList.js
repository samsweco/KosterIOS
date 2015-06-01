Ti.include("SQL.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};

setRowData();

//-----------------------------------------------------------
// Visar info för valt item i listvyn
//-----------------------------------------------------------
function showinfoDetails(info) {
	try {
		var selectedInfo = info.row;
		var args = {
			name : selectedInfo.name,
			infoTxt : selectedInfo.infoTxt,
			link : selectedInfo.link,
			img : selectedInfo.image,
			desc : selectedInfo.desc
		};

		var infoDetail = Alloy.createController("infoDetail", args).getView();
		infoDetail.open();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Infolistan");
	}
}

//-----------------------------------------------------------
// sätter alla items i listan
//-----------------------------------------------------------
function setRowData() {
	try {
		var tableViewData = [];
		var rows = returnAllInfo();

		for (var i = 0; i < rows.length; i++) {
			var row = Ti.UI.createTableViewRow({
				id : i + 1,
				layout : 'horizontal',
				height : '90dp',
				top : '0dp',
				hasChild : true
			});

			var labelView = Ti.UI.createView({
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL,
				backgroundColor : 'white',
				layout : 'vertical'
			});

			var coverimg = Ti.UI.createImageView({
				height : '70dp',
				width : '115dp',
				left : '5dp',
				image : "/pics/" + rows[i].cover_img,
				top : '10dp'
			});

			var lblName = Ti.UI.createLabel({
				left : '5dp',
				top : '2dp',
				color : '#FCAF17',
				font : {
					fontSize : '14dp',
					fontFamily: 'Raleway-Medium'
				},
				text : rows[i].name
			});

			labelView.add(lblName);

			row.add(coverimg);
			row.add(labelView);

			tableViewData.push(row);
		}
		$.table.data = tableViewData;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Infolistan");
	}
}

//-----------------------------------------------------------
// Hämtar all info som ska läsas in i listan
//-----------------------------------------------------------
function getInfoDetails(e) {
	try {
		var id = e.rowData.id;
		var infoObjJSON = returnSpecificInfo(id);

		var infoText = {
			name : infoObjJSON[0].name,
			infoTxt : infoObjJSON[0].infoTxt,
			id : id,
			img : infoObjJSON[0].cover_img,
			link : infoObjJSON[0].url,
			desc : infoObjJSON[0].desc,
		};

		var infoDetail = Alloy.createController("infoDetail", infoText).getView();
		Alloy.CFG.tabs.activeTab.open(infoDetail);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Infolistan");
	}
}
