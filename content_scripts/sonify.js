var elements = [];
var time = 500;

function isVisible(element) {
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

function delayedLoop(i, children, n) {
	var body = document.getElementsByTagName("body")[0];
	var item = children[i];
	
	tones.play(item.offsetHeight, null, item.offsetWidth);
	
	// item.scrollIntoView(true); Comentei, pois tava ficando tonto! =P
	item.className += " highlight";
	
	setTimeout(function () {
		var reg = new RegExp("(\\s|^)highlight(\\s|$)");
		item.className = item.className.replace(reg, "");
	
		if (i < n - 1) {
			delayedLoop(i + 1, children, n);
		}
	}, time);
};

function load(element) {
	if (isVisible(element)) {
		elements.push(element);
	}
	
	var children = element.childNodes;
	if (children.length != 0) {
		var i;
		for (i = 0; i < children.length; i++) {
			var item = children[i];
			if (item.nodeType == 1) {
				load(item);
			}
		}
	}
};

function sonify(request, sender, sendResponse) {
	delayedLoop(0, elements, elements.length);
	browser.runtime.onMessage.removeListener(sonify);
}

(function() {
	'use strict';
	var api;
	api = function(x,y) {
		var elm, scrollX, scrollY, newX, newY;
		scrollX = window.pageXOffset;
		scrollY = window.pageYOffset;
		window.scrollTo(x,y);
		newX = x - window.pageXOffset;
		newY = y - window.pageYOffset;
		elm = this.elementFromPoint(newX,newY);
		window.scrollTo(scrollX,scrollY);
		return elm;
	};
	this.document.elementFromAbsolutePoint = api;
}).call(this);

load(document.getElementsByTagName('body')[0], 0);
browser.runtime.onMessage.addListener(sonify);

