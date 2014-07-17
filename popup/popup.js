// Take user input from the popup and pass it to background.js, then aad.js
$(document).ready(function() {

    var numEntry$ = $('#numpad-text-entry'),
        submit$ = $('.numpad-submit'),
        tpIdLength = 6;
    
    $('.numpad a').on('click', function() {
        var num = $(this).text();
        var entry = numEntry$.val();
        if (entry.length < tpIdLength) {
            entry = entry + num;
            numEntry$.val(entry);
        } 
        setActiveState();
    });
    
    $('.numpad-delete').on('click', function() {
        var entry = numEntry$.val();
        // Remove the last number
        entry = entry.slice(0, -1);
        numEntry$.val(entry);
        setActiveState();
    });
    
    $('#numpad-text-entry').on('keyup', function() {
        setActiveState();
    });
    
    // Enter opens a ticket
    $(document).keypress(function(e) {
        if (e.which == 13) {
            submit$.trigger('click');
        }
    });
    
    submit$.on('click', function(e) {
        e.preventDefault();
        var id = numEntry$.val();
        if (id) {
            chrome.extension.sendRequest({msg: 'openTicket', tpid: id}, function(response){});
        }
    });
    
    // Actions above keypad
    $('#aad').on('click', function(e) {
        e.preventDefault();
        chrome.extension.sendRequest({msg: 'hideNoise'});
    });
    
    $('#fullscreen').on('click', function(e) {
        e.preventDefault();
        chrome.extension.sendRequest({msg: 'fullscreen'});
    });
    
    $('#add-title').on('click', function(e) {
        e.preventDefault();
        chrome.extension.sendRequest({msg: 'createStoryTitle'});
    });
    
    // Change the colour of the GO button to indicate a full TP id has been entered
    function setActiveState() {
        var idLen = numEntry$.val().length;
        if (idLen === tpIdLength) {
            submit$.addClass('active');
        } else {
            submit$.removeClass('active');
        }
    }
});
