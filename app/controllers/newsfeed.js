openFeedWindow();

function closeFeedWindow(){
	$.newsfeedWindow.close();
}

function openFeedWindow(){
	try {
		var webview = Titanium.UI.createWebView({
			url: 'https://www.instagram.com/kosterhavets.nationalpark/'
		});
		
		$.newsfeedView.add(webview);
	}  catch(e) {
		newError("Något gick fel när sidan skulle laddas. Kontrollera din internetanslutning och prova igen!");
	}
}
