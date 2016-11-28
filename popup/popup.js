// Take user input from the popup and pass it to background.js, then aad.js
$(document).ready(function() {

    var numEntry$ = $('#numpad-text-entry'),
        submit$ = $('.numpad-submit'),
        delete$ = $('.numpad-delete'),
        tpIdLength = 6,
        tpBaseUrl;

    // Get base TP URL
    chrome.storage.sync.get('tpUrl', function(items) {
        tpBaseUrl = items.tpUrl + '/entity/';
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

    function deleteSingleNum() {
        var entry = numEntry$.val();

        // Remove the last number
        entry = entry.slice(0, -1);
        numEntry$.val(entry);
        setActiveState();
    }

    function deleteWholeNum() {
        numEntry$.val('');
    }

    // Doubleclick behaviour
    var delay = 190,
        clicks = 0,
        timer = null;

    delete$.on('click', function(e){

        clicks++;
        if (clicks === 1) {

            timer = setTimeout(function() {

                deleteSingleNum();
                clicks = 0;

            }, delay);

        } else {

            clearTimeout(timer); // prevent single-click action
            deleteWholeNum();
            clicks = 0;
        }

    }).on('dblclick', function(e){

        // cancel system double-click event
        e.preventDefault();
    });

    $('.numpad a').on('click', function() {
        var num = $(this).text();
        var entry = numEntry$.val();
        if (entry.length < tpIdLength) {
            entry = entry + num;
            numEntry$.val(entry);
        }
        setActiveState();
    });

    $('#numpad-text-entry').on('keyup', function() {
        setActiveState();
    });

    // Enable keyboard input actions
    $(document).on('keypress', function(e) {

		// Backspace pressed
		if (e.which === 8) {
			deleteSingleNum();
		}

        // 0-9 pressed
        if (e.which === 48 || e.which === 49 || e.which === 50 ||
            e.which === 51 ||e.which === 52 || e.which === 53 ||
            e.which === 54 || e.which === 55 || e.which === 56 ||
            e.which === 57
        ) {
           return;
        }

        // Enter opens a ticket
        if (e.which == 13) {
            submit$.trigger('click');
        }
		
		// Cancel keydown - as we're triggering a click
		e.preventDefault();

    });

    /* Send actions to background.js */

    submit$.on('click', function(e) {
        e.preventDefault();
        var id = numEntry$.val();
        if (id) {
            chrome.runtime.sendMessage({method: 'openTicket', tpid: id, tpBaseUrl: tpBaseUrl});
        }
    });

    // Actions above keypad
    $('#aad').on('click', function(e) {
        e.preventDefault();
        chrome.runtime.sendMessage({method: 'hideNoise'});
    });

    $('#fullscreen').on('click', function(e) {
        e.preventDefault();
        chrome.runtime.sendMessage({method: 'fullscreen', tpBaseUrl: tpBaseUrl});
    });

    $('#add-title').on('click', function(e) {
        e.preventDefault();
        chrome.runtime.sendMessage({method: 'createStoryTitle'});
    });

    // Autocomplete - TODO
    //chrome.runtime.sendMessage({method: 'getTpIds'});
    //var tpIds = [];
    //chrome.storage.local.get('tpIds', function(items) {
        //items.tpIds;
    //});
});
