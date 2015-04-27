$.tabs.open();
Alloy.CFG.tabs = $.tabs;
exports.toInteractive = toInteractive;

//-----------------------------------------------------------
// Metoder för navigering
//-----------------------------------------------------------

function toMap() {
	var mapWind = Alloy.createController('map').getView();
	$.mapWin.add(mapWind);
}

function toInteractive() {
	var interactive = Alloy.createController('interactive').getView();
	$.interactiveWin.add(interactive);
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

$.interactiveWin.addEventListener('blur', function(){
	$.interactiveWin = null;
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

function showInteractive(){
	Alloy.Globals.showInteractive("Detta är ledtråden!");
}

// $.lblInteractive.addEventListener('click', function() {
	// Alloy.Globals.showInteractive("Detta är ledtråden!");
// });
