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
        var id = $('.entity-id a').text(); 
        if (id.length) {
            id = id.replace('#', '');
            window.location = tpBaseUrl + id;
        }
    };

    // Close open ticket
    module.closeOpenTicket = function() {
        var closePage$ = $('.tau-cover-view_page').find('.close');
        if (!closePage$.length) {
            return;
        } 
        closePage$.trigger('click');
    };

    // Open a ticket by its TPID
    module.openTicket = function(tpid, tpBaseUrl) {
        module.closeOpenTicket();
        
        var card$ = $('.i-role-card[data-entity-id="' + tpid + '"]'),
            mainSearch$ = $('.tau-search__input.i-role-search-string.i-role-resetable-target');
        
        // Target card exists: open it
        if (card$.length) {
            card$.simulate('dblclick');
        } else if (mainSearch$.length) {
            // Open ticket using the main search box as that's quicker than a page refresh
            mainSearch$.val(tpid);
            
            // Load IIFE script into TP website. Remove it after it has run.
            var s = document.createElement('script');
            s.src = chrome.extension.getURL('submit-search.js');
            s.onload = function() {
                this.parentNode.removeChild(this);
            };
            (document.head || document.documentElement).appendChild(s);
            
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
