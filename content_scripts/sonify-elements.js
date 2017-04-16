var elements = [];

var getPadding = function(style) {
	var p = parseInt(style.padding.replace(/[^-\d\.]/g, '')) || 0;
	var pt = parseInt(style.paddingTop.replace(/[^-\d\.]/g, '')) || 0;
	var pl = parseInt(style.paddingLeft.replace(/[^-\d\.]/g, '')) || 0;
	var pb = parseInt(style.paddingBottom.replace(/[^-\d\.]/g, '')) || 0;
	var pr = parseInt(style.paddingRight.replace(/[^-\d\.]/g, '')) || 0;
	return p + pt + pl + pb + pr;
};

var getBorderWidth = function(style) {
	var bw = parseInt(style.borderWidth.replace(/[^-\d\.]/g, '')) || 0;
	var btw = parseInt(style.borderTopWidth.replace(/[^-\d\.]/g, '')) || 0;
	var blw = parseInt(style.borderLeftWidth.replace(/[^-\d\.]/g, '')) || 0;
	var bbw = parseInt(style.borderBottomWidth.replace(/[^-\d\.]/g, '')) || 0;
	var brw = parseInt(style.borderRightWidth.replace(/[^-\d\.]/g, '')) || 0;
	return bw + btw + blw + bbw + brw;
};

var getMargin = function(style) {
	var m = parseInt(style.margin.replace(/[^-\d\.]/g, '')) || 0;
	var mt = parseInt(style.marginTop.replace(/[^-\d\.]/g, '')) || 0;
	var ml = parseInt(style.marginLeft.replace(/[^-\d\.]/g, '')) || 0;
	var mb = parseInt(style.marginBottom.replace(/[^-\d\.]/g, '')) || 0;
	var mr = parseInt(style.marginRight.replace(/[^-\d\.]/g, '')) || 0;
	return m + mt + ml + mb + mr;
};

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

// https://bost.ocks.org/mike/shuffle/
	var shuffle = function(array) {
	var m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
};

// http://youmightnotneedjquery.com/
var addClass = function(el, className) {
	if (el.classList) {
		el.classList.add(className);
	} else {
		el.className += ' ' + className;
	}
};

var removeClass = function(el, className) {
	if (el.classList) {
	 el.classList.remove(className);
	} else {
	 el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
};

var delayedLoop = function(i, children, synth) {
	var item = children[i];
	var note;
	var duration;

	if (synth == 1) {
		note = 32 + item.width * 32;
		duration = 500 + item.height * 500;
	} else if (synth == 2) {
		note = 32 + item.height * 32;
		duration = 500 + item.width * 500;
	}

	startNote(synth, parseInt(note));
	addClass(item.element, "sonification-addon-highlight");

	setTimeout(function () {
		stopNote(synth);
		removeClass(item.element, "sonification-addon-highlight");

		if (i < children.length - 1) {
			delayedLoop(i + 1, children, synth);
		}
	}, duration);
};

var startVoice1 = function() {
	delayedLoop(0, elements.slice(), 1);
};

var startVoice2 = function() {
	delayedLoop(0, shuffle(elements.slice()), 2);
};

var normalize = function(array, field) {
	var min = Math.min.apply(Math, array.map(function(item) { return item[field]; } ));
	if (min < 0) {
		array.map(function(item) {
			item[field] += Math.abs(min);
		});
	}
	var max = Math.max.apply(Math, array.map(function(item) { return item[field]; } ));
	array.map(function(item) {
		item[field] /= max;
	});
};

var normalizeAll = function() {
	normalize(elements, "width");
	normalize(elements, "height");
	normalize(elements, "top");
	normalize(elements, "left");
	normalize(elements, "padding");
	normalize(elements, "borderWidth");
	normalize(elements, "margin");
};

var load = function(element) {
	if (isVisible(element)) {
		var style = getComputedStyle(element, null);
		var el = {
			element: element,
			width: element.offsetWidth,
			height: element.offsetHeight,
			top: element.offsetTop,
			left: element.offsetLeft,
			padding: getPadding(style),
			borderWidth: getBorderWidth(style),
			margin: getMargin(style)
		};
		elements.push(el);
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
	initSynths();
	load(document.getElementsByTagName('body')[0]);
	normalizeAll();
	startVoice1();
	startVoice2();
	browser.runtime.onMessage.removeListener(sonify);
};

browser.runtime.onMessage.addListener(sonify);
