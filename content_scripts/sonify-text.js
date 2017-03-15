var histogram = {};

var delayedLoop = function(i, text, synth, scale) {
	var char = text[i];
	console.log(char);
	if (char in histogram) {
		startNote(histogram[char]);
	}

	setTimeout(function () {
		stopNote();

		if (i < text.length - 1) {
			delayedLoop(i + 1, text, synth, scale);
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
	initSynth(request.synth);
	load(document.getElementsByTagName('body')[0]);
	
	var values = minAndMax(histogram);
	for (key in histogram) {
		var num = histogram[key];
		histogram[key] = num.map(values[0], values[1], 440, 880)
	}
	
	var selection = window.getSelection().toString();
	if (selection) {
		delayedLoop(0, selection, request.synth, request.scale);
	} else {
		alert("you should select some text");
	}
	
	browser.runtime.onMessage.removeListener(sonify);
};

browser.runtime.onMessage.addListener(sonify);
