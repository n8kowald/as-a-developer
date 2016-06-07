(function() {
    // Simulate an 'enter' keydown event
    var enterKey = document.createEvent('Event');
    enterKey.initEvent('keydown', true, true);
    enterKey.keyCode = 13;
    
    // Dispatch event on the main search
    var mainSearch = document.querySelector('.tau-search__input.i-role-search-string.i-role-resetable-target');
    mainSearch.dispatchEvent(enterKey);
})();