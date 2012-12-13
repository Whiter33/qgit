//http://cdnjs.com/packages.json


//rule #1 of a hackathon - never be embarrassed to show what you threw together :)
var results = [];
$.getJSON('http://cdnjs.com/packages.json', function (data) {
    $.each(data.packages, function (key, val) {
        //terrible hacks to get around inconsistencies in the JSON
        if (val.repository != null) return;
        if (val.repositories === undefined) return;
        if (val.repositories.length === 0) return;


        var content = val.repositories[0].url;
        //another hack due to repo naming
        content = content.replace("git:", "https:");
        var description = val.name + " v" + val.version;

        //I need to talk to the cdnjs guys about the data. We could do a lot more if it was consistent.
        results.push({content: content, description: description});
    });
});

chrome.omnibox.onInputChanged.addListener(
    function (text, suggest) {
        var currentResults = [];

        currentResults = $.grep(results, function (result) {
                return result.description.substring(0, text.length) === text;
        });

        chrome.omnibox.setDefaultSuggestion({description: "choose from the list below"});
        suggest(currentResults);
    });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function (text) {
        chrome.tabs.getSelected(null, function(tab) {

            chrome.tabs.update(tab.id, {url: text});
        });
    });