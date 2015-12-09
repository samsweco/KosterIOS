Ti.include("SQL.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};

$.lblHotspotName.text = args.title || "Name";
$.lblHotspotInfoTxt.text = args.infoTxt || "Info";
var hotspotId = args.id || "Id";
var picId = args.filename || "filename";

selectHotspotPics();

//-----------------------------------------------------------
// Hämtar bilder för bildspelet
//-----------------------------------------------------------
function selectHotspotPics() {
	try {
		var picMediaJSON = returnSpecificPics(hotspotId);

		for (var i = 0; i < picMediaJSON.length; i++) {
			var img_view = Ti.UI.createImageView({
				image : "/images/" + picMediaJSON[i].filename + ".png",
				height : '200dp',
				width : '300dp',
				top : '0dp'
				});

			var lblImgTxt = Ti.UI.createLabel({
				left : '3dp',
				top : '0dp',
				text : picMediaJSON[i].img_txt,
				color : 'white',
				font : {
					fontSize : '12dp',
					fontStyle : 'italic',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					fontFamily: 'Raleway-Medium'
				}
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
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Sevärdheter");
	}
}

var cleanup = function() {
	$.destroy();
	$.off();
	$.hotspotWin = null;
};

$.hotspotWin.addEventListener('close', cleanup);
