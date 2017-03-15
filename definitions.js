var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

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

(function() {
	'use strict';
	var map;
	map = function(in_min, in_max, out_min, out_max) {
		return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	};
	Number.prototype.map = map;
}).call(this);
