var args = arguments[0] || {};

//-----------------------------------------------------------
// Args skickade från listvy
//-----------------------------------------------------------
try {
	$.lblInfoTitle.text = args.name || "Title";
	$.lblInfoText.text = args.infoTxt || "Info";
	$.lblInfoLink.text = args.desc || "url";
	$.infoImg.image = "/pics/" + args.img;
	
	var infoid = args.id;
	var url = args.link;

	var link = $.lblInfoLink;
	link.addEventListener('click', function(e) {
		openLink(url);
	});
	
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "infoDetail - load data into labels");
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