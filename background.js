chrome.storage.sync.get('tpUrl', function(items) {

    // No TP url saved storage. Ask for it.
    if (!items.tpUrl) {
        window.open('options.html', 'As a developer - options');
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

	// Pass message to add.js
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response) {});
    });
});
