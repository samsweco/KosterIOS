Ti.include('SQL.js');
var args = arguments[0] || {};
var urlCollection = Alloy.Collections.info_urlModel;

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
		urlCollection.fetch({
			query : query8 + id + '"'
		});

		var urlJson = urlCollection.toJSON();

		for (var i = 0; i < urlJson.length; i++) {
			var row = Ti.UI.createTableViewRow({
				id : urlJson[i].id,
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
				text : urlJson[i].linkname
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
		
		if(rowId != 3 && rowId != 4){			
			urlCollection.fetch({
				query : query9 + rowId + '"'
			});

			var jsonObj = urlCollection.toJSON();
			var web = jsonObj[0].url;

			openLink(web); 
		} else if(rowId == 3 || rowId == 4) {
			var pdfView = Ti.UI.createWindow({
				height: Ti.UI.SIZE,
				width: Ti.UI.FILL,
				backButtonTitle: 'Tillbaka',
				layout: 'vertical',
				backgroundColor: 'white'
			});
			
			var img;
			
			if(rowId == 3){
				img = Ti.UI.createImageView({
					image: '/images/regler_for_kosterhavets_nationalpark.png'
				});
			} else {
				img = Ti.UI.createImageView({
					image: '/images/regler_for_kosteroarnas_naturreservat.png'
				});
			}
			
			pdfView.add(img);
			
			Alloy.CFG.tabs.activeTab.open(pdfView);
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
