Ti.include('/SQL.js');

var info_urlCollection = Alloy.Collections.info_urlModel;

function returnUrlById(urlId) {
	info_urlCollection.fetch({
		query : getUrlById + urlId + '"'
	});
	var urlJson = info_urlCollection.toJSON();

	return urlJson;
}

function returnUrlByInfoId(infoId) {
	info_urlCollection.fetch({
		query : getUrlsByInfoId + infoId + '"'
	});
	var urlJson = info_urlCollection.toJSON();

	return urlJson;
}

