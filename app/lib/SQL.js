Ti.include("geoFunctions.js");

try {
	var query1 = 'SELECT filename FROM jsonFilesModel WHERE trailID ="';
	var query2 = 'SELECT id, infoTxt FROM hotspotModel where name = "';
	var query3 = 'SELECT name, latitude, longitude FROM infospotCoordinatesModel WHERE name ="';
	var query4 = 'SELECT hotspotModel.name, hotspotModel.xkoord, hotspotModel.ykoord from hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID ="';
	var query5 = 'SELECT name, latitude, longitude from infospotCoordinatesModel join infospot_trailsModel on infospot_trailsModel.infospotID = infospotCoordinatesModel.infospotID where trailsID ="';
	var query6 = 'SELECT * FROM mediaModel WHERE hotspot_id = "';
	var query7 = 'SELECT img_txt FROM mediaModel where filename = anemon.png';
	var query8 = 'SELECT * from info_urlModel WHERE info_id ="';
	var query9 = 'SELECT url FROM info_urlModel WHERE id = "';
	var query10 = 'SELECT * from infoModel where id = "';
	var query11 = 'SELECT * FROM trailsModel where name ="';
	var query12 = 'SELECT id, infoTxt FROM hotspotModel where name = "';
	var query13 = 'SELECT id, infoTxt from hotspotModel where name = "';
	var query14 = 'SELECT * from mediaModel where trail_id="';
	var query15 = 'SELECT hotspotModel.name, hotspotModel.cover_pic from hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID ="';
	var query16 = 'SELECT id, infoTxt from hotspotModel where name = "';
	var query17 = 'SELECT DISTINCT name from infospotCoordinatesModel join infospot_trailsModel on infospot_trailsModel.infospotID = infospotCoordinatesModel.infospotID where trailsID ="';
	var query18 = 'SELECT * FROM trailsModel where id ="';
	var query19 = 'SELECT DISTINCT name from infospotCoordinatesModel join infospot_trailsModel on infospot_trailsModel.infospotID = infospotCoordinatesModel.infospotID where trailsID ="';

} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "sql");
}

