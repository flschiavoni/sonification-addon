var elements = [];
var time = 500;

function delayedLoop(i, children, n) {
	var body = document.getElementsByTagName("body")[0];
	var item = children[i];
	
	tones.play(body.offsetWidth - item.offsetWidth);
	
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

function play() {
	delayedLoop(0, elements, elements.length);
};

function load(element) {
	elements.push(element);
	
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

