/**
* @author Nathan Kowald (@n8kowald)
* @since 17-07-2014
*/
(function() {

var TP = (function($) {

    var module = {},
        tpDomain = 'https://elevate.tpondemand.com/',
        tpTicketBase = tpDomain + 'entity/';
    
    module.removeNoise = function() {
        $('.tau-board-unit__value').text(function() { 
            return $(this).text().replace(/(as a .+ I .+? to)/gi, '');
        });
    };
    
    // Fullscreen an open TP ticket
    module.fullscreenTicket = function() {
        var id=$('.ui-title__info .entity-id a').text(); 
        if (id.length) {
            id=id.replace('#', '');
            tpUrl = tpTicketBase +  id
            window.location = tpUrl;
        }
    };
    
    // Open a ticket by its TPID
    module.openTicket = function(tpid) {
        var card$ = $('.i-role-card[data-entity-id="' + tpid + '"]');
        
        // Target card exists: open it
        if (card$.length) {
            card$.simulate('dblclick');
        } else {
            // Card not found: go to ticket directly
            window.location = tpTicketBase + tpid;
        }
    };
    
    // Add a user story title
    module.createStoryTitle = function() {
        var storyTitleInput$ = $('.tau-in-text.Name');
        if (storyTitleInput$.length) {
            storyTitleInput$.val('As a % I want to % so that %');
        }
    };
    
    return module;

})(jQuery);

// Accept actions from background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    switch (request.method) {
    
        case 'hideNoise':
            TP.removeNoise();
            break;
        
        case 'fullscreen':
            TP.fullscreenTicket();
            break;
            
        case 'openTicket':
            TP.openTicket(request.tpid);
            break;
            
        case 'createStoryTitle':
            TP.createStoryTitle();
            break;
    }
    
    return true;
});

})();
