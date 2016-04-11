Ti.include('/geoFunctions.js');
$.koster.open();

var infoVisible = false;
setTexts();

function setTexts(){
	if(language == 'svenska'){
		$.firstLbl.text = 'Välkommen till Kosterhavet!';
		$.secondLbl.text = 'Upptäck den vackra naturen i Kosterhavet och ta en promenad bland klapperstensfält och strandängar.';
	} else {
		$.firstLbl.text = 'Welcome to Kosterhavet!';
		$.secondLbl.text = 'Discover the beautiful nature of Kosterhavet and take a walk among the rubble fields and beach meadows.';
	}
	
	// setTxt('welcome_title');
}

// function setLang(e){
	// var lang = e.source.id;
	// language = lang;
	// setTexts();
// }

// function setTxt(txt){
// 	
	// if(language != ""){
		// var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "/texts/" + language + "/strings.xml").read().text;
		// var xmldata = Titanium.XML.parseString(file);
		// var data = xmldata.documentElement.getElementsByTagName(txt);
		// // return data.item(0).text;
// 		
		// Ti.API.info('file : ' + file);
		// Ti.API.info('xmldata : ' + JSON.stringify(xmldata.documentElement));
	// }
// 
// }


function closeWindow(){
	$.koster.close();
}