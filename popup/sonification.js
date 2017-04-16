
document.addEventListener("click", (e) => {
	if (e.target.nodeName == "BUTTON") {
		browser.tabs.executeScript(null, {
			file: "/content_scripts/" + e.target.id + ".js"
		});

		var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
		gettingActiveTab.then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, {});
		});
	}
});
