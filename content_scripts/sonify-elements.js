var elements = [];

var isVisible = function(element) {
	if (element.offsetHeight == 0 || element.offsetWidth == 0) {
		return false;
	}

	var rect = element.getBoundingClientRect();

	var top = rect.top;
	var left = rect.left;
	var topLeft = document.elementFromAbsolutePoint(left + 1, top + 1);

	var bottom = top + element.offsetHeight;
	var right = left + element.offsetWidth;
	var bottomRight = document.elementFromAbsolutePoint(right - 1, bottom - 1);

	return (topLeft === element) && (bottomRight === element);
};

var delayedLoop = function(i, children) {
	var body = document.getElementsByTagName("body")[0];
	var item = children[i];

	startNote(item.offsetWidth);
	item.className += " highlight";

	setTimeout(function () {
		stopNote();
		var reg = new RegExp("(\\s|^)highlight(\\s|$)");
		item.className = item.className.replace(reg, "");

		if (i < children.length - 1) {
			delayedLoop(i + 1, children);
		}
	}, 500); // FIXME: tempo fixo
};

var load = function(element) {
	if (isVisible(element)) {
		elements.push(element);
	}

	var children = element.childNodes;
	if (children.length != 0) {
		var i;
		for (i = 0; i < children.length; i++) {
			var item = children[i];
			if (item.nodeType == ELEMENT_NODE) {
				load(item);
			}
		}
	}
};

var sonify = function(request, sender, sendResponse) {
	initSynth(request.synth);
	load(document.getElementsByTagName('body')[0]);
	delayedLoop(0, elements);
	browser.runtime.onMessage.removeListener(sonify);
};

browser.runtime.onMessage.addListener(sonify);
