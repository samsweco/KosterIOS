var args = arguments[0] || {};

//-----------------------------------------------------------
// Öppnar vyn för interactive-funktionerna
//-----------------------------------------------------------

function openInteractive() {
			var interactiveWin = Alloy.createController("interactive").getView();
			Alloy.CFG.tabs.activeTab.open(interactiveWin);
}

exports.openInteractive = openInteractive;

