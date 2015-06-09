Ti.include('SQL.js');

var info_urlCollection = Alloy.Collections.info_urlModel;
var info_Collection = Alloy.Collections.infoModel;
var media_Collection = Alloy.Collections.mediaModel;
var trail_Collection = Alloy.Collections.trailsModel;
var infoCoord_Collection = Alloy.Collections.infospotCoordinatesModel;
var hotspot_Collection = Alloy.Collections.hotspotModel;
var jsonfile_Collection = Alloy.Collections.jsonFilesModel;
var letter_Collection = Alloy.Collections.letterModel;

var hotspotsModel = Alloy.Models.hotspotModel;
var lettersModel = Alloy.Models.letterModel;

//-----------------------------------------------------------
// Hämtar hotspotCollection
//-----------------------------------------------------------
function returnHotspotsToAlert() {
	var hotspotColl = Alloy.Collections.hotspotModel;
	hotspotColl.fetch({
		query : 'SELECT * FROM hotspotModel WHERE alerted = 0'
	});

	return hotspotColl.toJSON();
}

function setHotspotAlerted(id) {
	hotspotsModel.fetch({
		'id' : id
	});

	hotspotsModel.set({
		'alerted' : 1
	});
	hotspotsModel.save();
}

function returnBoatHotspots() {
	var hotspotColl = Alloy.Collections.hotspotModel;
	hotspotColl.fetch({
		query : 'SELECT * FROM hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID = 8'
	});

	return hotspotColl.toJSON();
}

//-----------------------------------------------------------
// Hämtar letterCollection och letterModel
//-----------------------------------------------------------
function setLetterOne(fId, fLetter){
	lettersModel.fetch({
		'id' : fId
	});
	Ti.API.info('Hämtar id: '+ fId);
	lettersModel.set({
		'found' : 1,
		'f_l' : fLetter
	});
	Ti.API.info('Sätter id: '+ fLetter);
	
	lettersModel.save();
	Ti.API.info(JSON.stringify(lettersModel));
}

function setLetterZero(letterId) {
	lettersModel.fetch({
		'id' : letterId
	});

	lettersModel.set({
		'found' : 0,
		'alerted' : 0,
		'f_l' : null
	});
	lettersModel.save();
}
// 
// function getLength() {
	// return fetchFoundLettersCol().length;
// }

function setAlertedOne(letterId) {
	lettersModel.fetch({
		'id' : letterId
	});

	lettersModel.set({
		'alerted' : 1
	});
	lettersModel.save();
}

function fetchAllLetters() {
//	var letterCollection = Alloy.Collections.letterModel;
	letter_Collection.fetch();

	return letter_Collection.toJSON();
}

function fetchFoundLettersCol() {
//	var letterCollection = Alloy.Collections.letterModel;
	letter_Collection.fetch({
		query : 'SELECT * FROM letterModel WHERE found = 1'
	});
	return letter_Collection.toJSON();
	
	Ti.API.info('fetching: '+JSON.stringify(letter_Collection));
}

function fetchUnFoundLettersCol() {
//	var letterCollection = Alloy.Collections.letterModel;
	letter_Collection.fetch({
		query : 'SELECT * FROM letterModel WHERE found = 0'
	});
	return letter_Collection.toJSON();
}

function fetchOneLetter(lId) {
//	var letterCollection = Alloy.Collections.letterModel;
	letter_Collection.fetch({
		query : 'SELECT * FROM letterModel WHERE id =' + lId
	});
	
	Ti.API.info(JSON.stringify(letter_Collection));
	
	return letter_Collection.toJSON();
}

//-----------------------------------------------------------
// infoUrl
//-----------------------------------------------------------
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


//-----------------------------------------------------------
// info
//-----------------------------------------------------------
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


//-----------------------------------------------------------
// media
//-----------------------------------------------------------
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


//-----------------------------------------------------------
// trail
//-----------------------------------------------------------
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


//-----------------------------------------------------------
// infoCoord
//-----------------------------------------------------------
function returnSpecificIconsByTrailId(iconTrailInfId) {
	infoCoord_Collection.fetch({
		query : getDistInfospotsByTrailId + iconTrailInfId + '"'
	});
	var infoCoordJson = infoCoord_Collection.toJSON();

	return infoCoordJson;
}

function returnSpecificIconsByType(infoType) {
	infoCoord_Collection.fetch({
		query : getInfoCoordByType + infoType + '"'
	});
	var infoCoordJson = infoCoord_Collection.toJSON();

	return infoCoordJson;
}

function returnIconsByTrailId(trailId) {
	infoCoord_Collection.fetch({
		query : getInfospotsByTrailId + trailId + '"'
	});
	var infoCoordJson = infoCoord_Collection.toJSON();

	return infoCoordJson;
}


//-----------------------------------------------------------
// hotspot
//-----------------------------------------------------------
function returnSpecificHotspotsByTrailId(trailId) {
	hotspot_Collection.fetch({
		query : getHotspotsByTrailId + trailId + '"'
	});
	var hotspotJson = hotspot_Collection.toJSON();

	return hotspotJson;
}

function returnHotspots() {
	hotspot_Collection.fetch();
	var hotspotJson = hotspot_Collection.toJSON();

	return hotspotJson;
}

function returnSpecificHotspotsByName(name) {
	hotspot_Collection.fetch({
		query : getHotspotByName + name + '"'
	});
	var hotspotJson = hotspot_Collection.toJSON();

	return hotspotJson;
}


//-----------------------------------------------------------
// jsonFile
//-----------------------------------------------------------
function returnJsonFiles(id) {
	jsonfile_Collection.fetch({
			query : getJsonFileById + id + '"'
		});
	var jsonfileJson = jsonfile_Collection.toJSON();

	return jsonfileJson;
}


//-----------------------------------------------------------
// letters
//-----------------------------------------------------------
function returnLetters() {
	letter_Collection.fetch();
	var letterJson = letter_Collection.toJSON();

	return letterJson;
}

