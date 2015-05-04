var addedToMap = {};
 
 
if (!e.rowData.active) {
                    e.rowData.active = true;
                    e.row.leftImage = '/images/' + e.rowData.type + '.png';
                    var md = getMapData(e.rowData.type);
                                                              mapview.addAnnotations(md);
                                                              addedToMap[e.rowData.type] = md;
                                                  } else {
                                                              e.rowData.active = false;
                                                              e.row.leftImage = '/images/' + e.rowData.type + '_d.png';
                                                              var a = addedToMap[e.rowData.type];
                                                              for (var anno = 0; anno < a.length; anno++) {
                                                                          mapview.removeAnnotation(a[anno]);
                                                              }
                                                  }
 
 
            function getMapData(type) {
                         var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "geodata/" + type +".json").read().text;
                         var v = JSON.parse(f);
                         var j = new Array();
                         for (var i = 0; i < v.items.length; i++) {
                                     var h = v.items[i];
                                     j.push(createAnnotation(h, type, 'Etapp: ' + h.etappId, true));
                         }
                         return j;
            }



function removeAnnoInfospot(infotype) {
	var addedToMap = [];
	var arrayAnno = [];

	arrayAnno = displayInfoSpots(infotype);
	addedToMap[infotype] = arrayAnno;

	for (var ia = 0; ia < addedToMap.length; ia++) {
		baseMap.removeAnnotation(addedToMap[ia].id);
	}
}

function reoveAnnoHotspot(){
	var arrayAnno = [];
	arrayAnno = displayMarkers();

	for (var ih = 0; ih < arrayAnno.length; ih++) {
		baseMap.removeAnnotation(arrayAnno[ih].title);
	}
}
