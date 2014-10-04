$(document).ready(function() {

    var tpUrl;

    function saveOptions(options) {

        chrome.storage.sync.set(options, function() {

            var savedMsg = 'Saved, thanks!',
                updatedMsg = 'Updated, thanks!';
            
            var msg = options.tpUrl === tpUrl ?
                savedMsg : updatedMsg;

            // Update status to let user know options were saved.
            $('#aad-status')
                .text(msg)
                .fadeIn(500)
                .delay(1500)
                .fadeOut(1000);

            // Update var
            tpUrl = options.tpUrl;
       });
    }

    function setURLValueIfSaved() {
        if (chrome.storage.sync.get('tpUrl', function(items) {
            if (items.tpUrl) {

                // Update URL value
               $('#aad-tp-url').val(items.tpUrl); 

                // Store
                tpUrl = items.tpUrl;
            }
        }));
    }

    setURLValueIfSaved();

    $('#btn-save').on('click', function(e) {
        e.preventDefault();

        var tpUrlVal = $('#aad-tp-url').val();

        // Add trailing slash if it doesn't exist
        tpUrlVal = tpUrlVal.replace(/\/?$/, '/');

        // Save
        saveOptions({tpUrl : tpUrlVal});
    });
});
