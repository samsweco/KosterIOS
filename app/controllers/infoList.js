Ti.include("SQL.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};

setRowData();

//-----------------------------------------------------------
// Sätter label med rätt font som windowtitle
//-----------------------------------------------------------
var windowTitle = Ti.UI.createLabel({
	text: String.format(L('information_row'), ''),
	font: {
		fontSize: '17dp',
		fontFamily: 'Raleway-Medium'
	}
});
$.infoWindow.titleControl = windowTitle;

//-----------------------------------------------------------
// Visar info för valt item i listvyn
//-----------------------------------------------------------
function showinfoDetails(info) {
	try {
		var selectedInfo = info.row;
		var args = {
			name : selectedInfo.name,
			nameEng : selectedInfo.name_eng,
			infoTxt : selectedInfo.infoTxt,
			infoTxtEng : selectedInfo.infoTxt_eng,
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
				image : "/images/" + rows[i].cover_img,
				top : '10dp'
			});

			var lblName = Ti.UI.createLabel({
				left : '5dp',
				top : '2dp',
				color : '#FCAF17',
				font : {
					fontSize : '14dp',
					fontFamily: 'Raleway-Medium'
				}
			});
			
			if(language == 'svenska'){
				lblName.text = rows[i].name;
			} else {
				lblName.text = rows[i].name_eng;
			}

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
			nameEng : infoObjJSON[0].name_eng,
			infoTxt : infoObjJSON[0].infoTxt,
			infoTxtEng : infoObjJSON[0].infoTxt_eng,
			id : id,
			img : infoObjJSON[0].cover_img,
			link : infoObjJSON[0].url,
			desc : infoObjJSON[0].desc,
		};

		var infoDetail = Alloy.createController("infoDetail", infoText).getView();//.open();
		$.infoNav.openWindow(infoDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Infolistan");
	}
}

//-----------------------------------------------------------
// Funktioner för att stänga sidan helt när man öppnar en annan
//-----------------------------------------------------------

function closeInfoWindow(){
	$.infoNav.close();
}

var cleanup = function() {
	$.destroy();
	$.off();
	$.infoDetail = null;
};

$.infoWindow.addEventListener('onclose', cleanup);
