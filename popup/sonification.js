
document.addEventListener("click", (e) => {
	browser.tabs.executeScript(null, {
		file: "/content_scripts/sonify.js"
	});
	
	var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
	gettingActiveTab.then((tabs) => {
		browser.tabs.sendMessage(tabs[0].id, {});
	});
});

