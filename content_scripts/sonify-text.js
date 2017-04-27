var histogram = {};

var delayedLoop = function(i, text) {
	var char = text[i];
	console.log(char, histogram[char]);

	if (char in histogram) {
		startNote(1, parseInt(histogram[char]), 1);
	}

	setTimeout(function () {
		stopNote(1);

		if (i < text.length - 1) {
			delayedLoop(i + 1, text);
		}
	}, 500); // FIXME: tempo fixo
};

var load = function(element) {
	var children = element.childNodes;
	if (children.length != 0) {
		var i;
		for (i = 0; i < children.length; i++) {
			var item = children[i];
			if (item.nodeType == TEXT_NODE) {
				var text = item.data.replace(/\s/g, '');
				if (text.length > 0) {
					for (var i = 0; i < text.length; i++) {
						var char = text[i];
						if (char in histogram) {
							histogram[char] += 1;
						} else {
							histogram[char] = 0;
						}
					}
				}
			}
			load(item);
		}
	}
};

var minAndMax = function(dict) {
	var min = null;
	var max = null;
	for (key in dict) {
		if (!min || dict[key] < min) {
			min = dict[key];
		}
		if (!max || dict[key] > max) {
			max = dict[key];
		}
	}
	return [min, max];
};

var sonify = function(request, sender, sendResponse) {
	console.log("A");
	initSynths();
	console.log("B");
	load(document.getElementsByTagName('body')[0]);
	console.log("C");
	var values = minAndMax(histogram);
	for (key in histogram) {
		var num = histogram[key];
		histogram[key] = num.map(values[0], values[1], 32, 64);
	}
	console.log("D");
	var selection = window.getSelection().toString();
	if (selection) {
		delayedLoop(0, selection);
	} else {
		alert("you should select some text");
	}
	console.log("E");
	browser.runtime.onMessage.removeListener(sonify);
};

browser.runtime.onMessage.addListener(sonify);
