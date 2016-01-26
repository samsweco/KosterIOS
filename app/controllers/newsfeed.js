//Ti.include('instafeed.html');

var webview = Titanium.UI.createWebView({
	//html : '<iframe src="" allowtransparency="true" frameborder="0" scrolling="no" style="border:none;overflow:hidden;width:230px; height: 575px" ></iframe>'
	// html: '<!DOCTYPE html><html><head><title>Kosterhavets instagram</title></head>'
		// +	'<body><!-- INSTANSIVE WIDGET --><script src="//instansive.com/widget/js/instansive.js"></script>'
		// +	'<iframe src="//instansive.com/widgets/787f0ec8a0f6a0a6433decfea86d5c9c86805ac3.html" id="instansive_787f0ec8a0" name="instansive_787f0ec8a0" scrolling="no" allowtransparency="yes" class="instansive-widget">'
		// +	'</iframe></body></html>'
		
	//url : "/lib/instafeed.html" 
	url: 'https://www.instagram.com/kosterhavets.nationalpark/'
});

$.newsfeedView.add(webview);

