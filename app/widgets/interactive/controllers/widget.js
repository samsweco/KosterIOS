

function showInteractive(clueTxt) {
	if (!interactiveVisible) {
		$.interactiveView.height = '100dp';
		$.interactiveView.visible = true;
		$.lblClue.text = clueTxt;
		interactiveVisible = true;
	} else {
		$.interactiveView.visible = false;
		interactiveVisible = false;
	}	
}

Alloy.Globals.showInteractive = showInteractive;

function closeInteractive() {
	$.interactiveView.hide();
	interactiveVisible = false;
}

Alloy.Globals.closeInteractive = closeInteractive;