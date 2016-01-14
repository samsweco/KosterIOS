Ti.include("geoFunctions.js");

try {
	var getJsonFileById = 'SELECT * FROM jsonFilesModel WHERE trailID ="';

	var getHotspotByName = 'SELECT * FROM hotspotModel where name = "';
	var getHotspotById = 'SELECT * FROM hotspotModel where id = "';

	var getInfoCoordByType = 'SELECT * FROM infospotCoordinatesModel WHERE name ="';
	var getHotspotsByTrailId = 'SELECT * FROM hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID ="';
	var getInfospotsByTrailId = 'SELECT * FROM infospotCoordinatesModel join infospot_trailsModel on infospot_trailsModel.infospotID = infospotCoordinatesModel.infospotID where trailsID ="';
	var getImgsByHotspotId = 'SELECT * FROM mediaModel WHERE hotspot_id = "';

	var getUrlsByInfoId = 'SELECT * from info_urlModel WHERE info_id ="';
	var getUrlById = 'SELECT * from info_urlModel WHERE id ="';
	var getInfoById = 'SELECT * from infoModel where id = "';

	var getTrailByName = 'SELECT * FROM trailsModel where name ="';
	var getTrailById = 'SELECT * FROM trailsModel where id ="';
	var getTrailByHotspot = 'SELECT trailsID FROM hotspot_trailsModel WHERE hotspotID = "';

	var getImgsForTrailById = 'SELECT * from mediaModel where trail_id="';
	var getDistInfospotsByTrailId = 'SELECT DISTINCT name from infospotCoordinatesModel join infospot_trailsModel on infospot_trailsModel.infospotID = infospotCoordinatesModel.infospotID where trailsID ="';

} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "sql");
}
