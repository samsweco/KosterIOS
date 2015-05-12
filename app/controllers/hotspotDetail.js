Ti.include("SQL.js");
var args = arguments[0] || {};

$.lblHotspotName.text = args.title || "Name";
$.lblHotspotInfoTxt.text = args.infoTxt || "Info";

var hotspotId = args.id || "Id";
var picId = args.filename || "filename";

setPics();
//setPicText();

//-----------------------------------------------------------
// Sätter bilder till bildspelet
//-----------------------------------------------------------
function setPics() {
	try {
		selectHotspotPics();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "HotspotDetail - setPics");
	}
}

//-----------------------------------------------------------
// Hämtar bilder för bildspelet
//-----------------------------------------------------------
function selectHotspotPics() {
	try {
		var mediaCollection = getMediaCollection();
		mediaCollection.fetch({
			query : query6 + hotspotId + '"'
		});
		var jsonMedia = mediaCollection.toJSON();

		for (var i = 0; i < jsonMedia.length; i++) {

			var img_view = Ti.UI.createView({
				backgroundImage : "/pics/" + jsonMedia[i].filename,
				height : '200dp',
				width : '300dp',
				top : '0dp'
				});

			var lblImgTxt = Ti.UI.createLabel({
				left : '3dp',
				top : '0dp',
				text : jsonMedia[i].img_txt,
				color : 'white',
				font : {
					fontSize : '12dp',
					fontStyle : 'italic',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					fontFamily: 'Raleway-Medium'
				},
				
			});

			var backgroundView = Ti.UI.createView({
				layout : 'vertical',
				backgroundColor : 'black',
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE
			});

			backgroundView.add(img_view);
			backgroundView.add(lblImgTxt);
			
			$.slideShowHotspotDetail.addView(backgroundView);
			//$.slideShowHotspotDetail.add(lblImgTxt);
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "HotspotDetail - selectHotspotPics");
	}
}

//---------------------------------------------------------
//Sätter bildtexter till hotspotsen
//---------------------------------------------------------
function setPicText() {

	var textCollection = Alloy.Collections.mediaModel;
	textCollection.fetch(query7);

	txt = textCollection.toJSON();
	text = JSON.stringify(txt);
}

