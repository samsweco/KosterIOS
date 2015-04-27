

function showInteractive(clueTxt) {
	if (!interactiveVisible) {
		$.interactive.height = '100dp';
		$.interactive.visible = true;
		$.lblClue.text = clueTxt;
		interactiveVisible = true;
	} else {
		$.interactive.visible = false;
		interactiveVisible = false;
	}	
}

Alloy.Globals.showInteractive = showInteractive;

function closeInteractive() {
	$.interactive.hide();
	interactiveVisible = false;
}

Alloy.Globals.closeInteractive = closeInteractive;