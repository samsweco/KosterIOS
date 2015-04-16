$.tabs.open();
Alloy.CFG.tabs = $.tabs;
exports.toQuiz = toQuiz;

//-----------------------------------------------------------
// Metoder för navigering
//-----------------------------------------------------------

function toMap() {
	var mapWind = Alloy.createController('map').getView();
	$.mapWin.add(mapWind);
}

function toQuiz() {
	var quizDetail = Alloy.createController('quizDetail').getView();
	$.quizWin.add(quizDetail);
}


function toTrails() {
	var trails = Alloy.createController('trails').getView();
	$.hikeWin.add(trails);
}

function toInfo() {
	var info = Alloy.createController('infoList').getView();
	$.infoWin.add(info);
}

//-----------------------------------------------------------
// Null'ar varje fönster när man trycker på en annan tab.
//-----------------------------------------------------------

$.mapWin.addEventListener('blur', function(){
	$.mapWin = null;
});

$.quizWin.addEventListener('blur', function(){
	$.quizWin = null;
});

$.hikeWin.addEventListener('blur', function(){
	$.hikeWin = null;
});

$.infoWin.addEventListener('blur', function(){
	$.infoWin = null;
});

$.koster.addEventListener('blur', function(){
	$.koster = null;
});


function showMenu(){
	Alloy.Globals.showMenuWidget();
}

function getPos(){
	Alloy.Globals.setUserPosition();
}
