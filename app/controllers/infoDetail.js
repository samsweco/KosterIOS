var args = arguments[0] || {};

//-----------------------------------------------------------
// Args skickade från listvy
//-----------------------------------------------------------
try {
	$.lblInfoTitle.text = args.name || "Title";
	$.lblInfoText.text = args.infoTxt || "Info";
	$.lblInfoLink.text = args.desc || "url";
	$.infoImg.image = "/pics/" + args.img;
	var id = args.id;
	
	var infoid = args.id;

	// var link = $.lblInfoLink;
	// link.addEventListener('click', function(e) {
		// openLink(url);
	// });
	
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "infoDetail - load data into labels");
}

function createLinks(){
	var urlCollection = Alloy.Collections.info_urlModel;
	urlCollection.fetch({
		query : 'SELECT * from info_urlModel WHERE info_id ="' + id + '"'
	});
	
	var urlJson = urlCollection.toJSON();
	
	for(var i = 0; i<urlJson.length; i++){
		
		var txt = Ti.UI.createLabel({
			text : urlJson[i].url_text,
		});
		
		var linkName = Ti.UI.createLabel({
			text : urlJson[i].linkname
		});
		
		 linkName.addEventListener('click', function(e) {
			openLink(urlJson[i].url);
			});
		
		
		$.linkView.add(txt);
		$.linkView.add(linkName);
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
		newError("Något gick fel när sidan skulle laddas, prova igen!", "infoDetail - openLink");
	}
}