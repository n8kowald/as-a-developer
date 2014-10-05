/**
* @author Nathan Kowald (@n8kowald)
* @since 17-07-2014
*/
(function() {

var TP = (function($) {

    var module = {};
    
    module.removeNoise = function() {
        $('.tau-board-unit__value').add('.ui-title__title')
            .text(function() { 
                return $(this).text().replace(/(as a .+? I .+? to)/gi, '');
            });
    };
    
    // Fullscreen an open TP ticket
    module.fullscreenTicket = function(tpBaseUrl) {
        var id = $('.ui-title__info .entity-id a').text(); 
        if (id.length) {
            id = id.replace('#', '');
            window.location = tpBaseUrl + id;
        }
    };
    
    // Open a ticket by its TPID
    module.openTicket = function(tpid, tpBaseUrl) {
        var card$ = $('.i-role-card[data-entity-id="' + tpid + '"]');
        
        // Target card exists: open it
        if (card$.length) {
            card$.simulate('dblclick');
        } else {
            // Card not found: go to ticket directly
            window.location = tpBaseUrl + tpid;
        }
    };
    
    // Add a user story title
    module.createStoryTitle = function() {
        var storyTitleInput$ = $('.tau-in-text.Name');
        if (storyTitleInput$.length) {
            storyTitleInput$.val(
                'As a %role%, I want %goal or need%, so that %benefit%'
            );
        }
    };

    module.getTpIds = function() {
        var tpIds = [];
        $('.tau-board-unit-link').each(function(i, v) { 
            tpIds.push($(this).data('entity-id')); 
        }); 

        // Remove dupes
        tpIds = $.unique(tpIds);

        return tpIds;
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
            TP.fullscreenTicket(request.tpBaseUrl);
            break;
            
        case 'openTicket':
            TP.openTicket(request.tpid, request.tpBaseUrl);
            break;
            
        case 'createStoryTitle':
            TP.createStoryTitle();
            break;

        case 'getTpIds':
            chrome.storage.local.set({'tpIds' : TP.getTpIds()});
            break;

		default:
    }
    
    return true;
});

})();
