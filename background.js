(function() {

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    
    // Remove as a developer etc.
    if (request.msg === 'hideNoise') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {method: 'hideNoise'}, function(response) {});
        });
    }
    
    // Make a TP ticket fullscreen
    if (request.msg === 'fullscreen') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {method: 'fullscreen'}, function(response) {});
        });
    }
    
    // Open a ticket
    if (request.msg === 'openTicket') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                method: 'openTicket', 
                tpid: request.tpid
            }, function(response) {});
        });
    }
    
    // Create story title
    if (request.msg === 'createStoryTitle') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {method: 'createStoryTitle'}, function(response) {});
        });
    }
    
});

})();
