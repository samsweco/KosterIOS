Ti.include('/geoFunctions.js');
$.koster.open();

var infoVisible = false;

function closeWindow(){
	$.koster.close();
}

$.firstLbl.text = L('welcome_title'); //setText
$.secondLbl.text = L('welcome_txt');

// $.sweLang.addEventlistener('click', function(e){
	// language = 'sv';
// });
// 
// $.engLang.addEventlistener('click', function(e){
	// language = 'en';
// });

function changeLang(e){
	
	if(e.source.id == 'sweLang'){
		language = 'sv';
	} else if(e.source.id == 'engLang'){
		language = 'en';
	}
	
}

function setText(text){
	
	var filesource;
	
	if(language != ""){
		
		filesource = "/data/" + language + "/strings.xml";
		
		// // var langFile = Titanium.App.Properties.getString("lang");	
		// var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/data/" + language + "/");//+"strings.xml");
		// var xmltext = file.read().text;
		// var xmldata=Titanium.XML.parseString(xmltext);
		// var data = xmldata.documentElement.getElementsByTagName(text);
		// return data.item(0).text;
	} else {
		if (Ti.Locale.currentLanguage == 'sv') { 
			
			filesource = "/data/sv/strings.xml";
			
		} else {
			
			 filesource = "/data/en/strings.xml";
						
		}
	}

	Ti.API.info('filesource: ' + filesource);

	// var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, filesource).read().text;
	// var xmldata = Titanium.XML.parseString(file);
	// var data = xmldata.documentElement.getElementsByTagName(text);
	// return data.item(0).text;

}