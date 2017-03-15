var getCheckedRadio = function(name) {
	var radios = document.getElementsByName(name);
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			return radios[i].value;
		}
	}
};

document.addEventListener("click", (e) => {
	if (e.target.nodeName == "BUTTON") {
		browser.tabs.executeScript(null, {
			file: "/content_scripts/" + e.target.id + ".js"
		});

		var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
		gettingActiveTab.then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, {
				synth: getCheckedRadio("synth"),
				scale: getCheckedRadio("scale")
			});
		});
	}
});
