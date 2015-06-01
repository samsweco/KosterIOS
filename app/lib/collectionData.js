Ti.include('SQL.js');

var info_urlCollection = Alloy.Collections.info_urlModel;
var info_Collection = Alloy.Collections.infoModel;
var media_Collection = Alloy.Collections.mediaModel;
var trail_Collection = Alloy.Collections.trailsModel;
var infoCoord_Collection = Alloy.Collections.infospotCoordinatesModel;
var hotspot_Collection = Alloy.Collections.hotspotModel;

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

function returnAllInfo() {
	info_Collection.fetch();
	var infoJson = info_Collection.toJSON();

	return infoJson;
}

function returnSpecificInfo(infoSpecId) {
	info_Collection.fetch({
		query : getInfoById + infoSpecId + '"'
	});
	var infoJson = info_Collection.toJSON();

	return infoJson;
}

function returnSpecificPics(SpecPicId) {
	media_Collection.fetch({
		query : getImgsByHotspotId + SpecPicId + '"'
	});
	var mediaJson = media_Collection.toJSON();

	return mediaJson;
}

function returnSpecificTrailPics(trailId) {
	media_Collection.fetch({
		query : getImgsForTrailById + trailId + '"'
	});
	var mediaJson = media_Collection.toJSON();

	return mediaJson;
}

function returnTrails() {
	trail_Collection.fetch();
	var trailJson = trail_Collection.toJSON();

	return trailJson;
}

function returnSpecificTrail(trailName) {
	trail_Collection.fetch({
		query : getTrailByName + trailName + '"'
	});
	var trailJson = trail_Collection.toJSON();

	return trailJson;
}

function returnSpecificTrailById(trailId) {
	trail_Collection.fetch({
		query : getTrailById + trailId + '"'
	});
	var trailJson = trail_Collection.toJSON();

	return trailJson;
}

function returnSpecificIconsByTrailId(iconTrailInfId) {
	infoCoord_Collection.fetch({
		query : getDistInfospotsByTrailId + iconTrailInfId + '"'
	});
	var infoCoordJson = infoCoord_Collection.toJSON();

	return infoCoordJson;
}

function returnSpecificHotspotsByTrailId(trailId) {
	hotspot_Collection.fetch({
		query : getHotspotsByTrailId + trailId + '"'
	});
	var hotspotJson = hotspot_Collection.toJSON();

	return hotspotJson;
}

