Ti.include("geoFunctions.js");

var query1 = 'SELECT filename FROM jsonFilesModel WHERE trailID ="';
var query2 = 'SELECT id, infoTxt FROM hotspotModel where name = "';
var query3 = 'SELECT name, latitude, longitude FROM infospotCoordinatesModel WHERE name ="';
var query4 = 'SELECT hotspotModel.name, hotspotModel.xkoord, hotspotModel.ykoord from hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID ="';
var query5 = 'SELECT name, latitude, longitude from infospotCoordinatesModel join infospot_trailsModel on infospot_trailsModel.infospotID = infospotCoordinatesModel.infospotID where trailsID ="';
var query6 = 'SELECT * FROM mediaModel WHERE hotspot_id = "';
var query7 = 'SELECT img_txt FROM mediaModel where filename = anemon.png';
var query8 = 'SELECT * from info_urlModel WHERE info_id ="';
var query9 = 'SELECT url FROM info_urlModel WHERE id = "';