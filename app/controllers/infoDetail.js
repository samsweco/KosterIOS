Ti.include('SQL.js');
Ti.include("collectionData.js");

var args = arguments[0] || {};

try {
	$.lblInfoTitle1.text = args.name || "Title";
	$.infoImg.image = "/pics/" + args.img;
	$.lblInfoText.text = args.infoTxt;
	var id = args.id;

} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
}

setRowData();

//-----------------------------------------------------------
// Visar info för valt item i listvyn
//-----------------------------------------------------------
function showinfoDetails(info) {
	try {
		var selectedInfo = info.row;
		var args = {
			id : selectedInfo.id,
			name : selectedInfo.name,
			infoTxt : selectedInfo.infoTxt,
			link : selectedInfo.link,
			img : selectedInfo.image,
			desc : selectedInfo.desc
		};

		var infoDetail = Alloy.createController("infoDetail", args).getView();
		infoDetail.open();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}

//-----------------------------------------------------------
// sätter alla items i listan
//-----------------------------------------------------------
function setRowData() {
	try {
		var tableViewData = [];
		var urlList = returnUrlByInfoId(id);

		for (var i = 0; i < urlList.length; i++) {
			var row = Ti.UI.createTableViewRow({
				id : urlList[i].id,
				height : '60dp',
				top : '0dp',
				hasChild : true
			});

			var linkName = Ti.UI.createLabel({
				width : Ti.UI.FILL,
				left : '15dp',
				right : '15dp',
				font : {
					fontSize : '13dp',
				},
				color : '#0098C3',
				text : urlList[i].linkname
			});

			row.add(linkName);
			tableViewData.push(row);
		}

		if (tableViewData.length > 0) {
			$.tableView.data = tableViewData;
			$.lblLink.show();
		}
		else {
			$.lblLink.hide();
			$.tableView.height = 0;
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}

//-----------------------------------------------------------
// Hämtar all info som ska läsas in i listan
//-----------------------------------------------------------
function getLink(e) {
	try {
		var rowId = e.rowData.id;
		
		var urlById = returnUrlById(rowId);
		
		if(rowId != 3 && rowId != 4){			
			var web = urlById[0].url;
			openLink(web); 
		} else if(rowId == 3 || rowId == 4){
			var txt = urlById[0].url;
			var titl = urlById[0].linkname; 
			showRules(txt, titl);
		} 	
			
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}

//-----------------------------------------------------------
// Öppnar url'en i en webView.
//-----------------------------------------------------------
function openLink(link) {
	try {
		var webview = Titanium.UI.createWebView({
			url : link
		});
		var window = Titanium.UI.createWindow();
		window.backButtonTitle = "Tillbaka";

		window.add(webview);
		Alloy.CFG.tabs.activeTab.open(window);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}

//-----------------------------------------------------------
// Öppnar regler i en egen vy
//-----------------------------------------------------------
function showRules(infTxt, linktitle){
	try {
		var infoWindowRules = Ti.UI.createWindow({
			layout : 'vertical',
			top : '0dp',
			backgroundColor : 'white',
			backButtonTitle : "Tillbaka"
		});

		var infoScrollRules = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : true,
			layout : 'vertical',
			top : '0dp'
		});

		var viewen = Ti.UI.createView({
			layout : 'vertical',
			top : '0dp',
			height : Ti.UI.SIZE
		});

		var infoDetailTitleLbl = Ti.UI.createLabel({
			top : '10dp',
			left : '15dp',
			right : '15dp',
			font : {
				fontSize : '15dp',
				fontFamily : 'Raleway-Medium'
			},
			color : '#FCAF17',
			text : linktitle
		});

		var infoDetailLbl = Ti.UI.createLabel({
			top : '10dp',
			left : '15dp',
			right : '15dp',
			font : {
				fontSize : '14dp',
				fontFamily : 'Raleway-Light'
			},
			color : 'black',
			text : infTxt
		});

		viewen.add(infoDetailTitleLbl);
		viewen.add(infoDetailLbl);
		infoScrollRules.add(viewen);
		infoWindowRules.add(infoScrollRules);

		Alloy.CFG.tabs.activeTab.open(infoWindowRules);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}

var cleanup = function() {
	$.destroy();
	$.off();
	$.infoDetail = null;
};

$.infoDetail.addEventListener('close', cleanup);

