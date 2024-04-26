define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('clickedNext', save);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on("requestedTokens", onGetTokens);

    function onGetTokens(tokens) {
      console.log(tokens);
    }
    function onRender() {
        connection.trigger('ready');
        connection.trigger("requestTokens");
    }

    function initialize(data) {
        if (data) {
            payload = data;
            console.log(payload);
            var setcpURL = payload['arguments'].execute.inArguments[0].cloudpageURL;
            $('#cpURL').val(setcpURL);
        }
    }

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
    }

    function save() {
        var cpURL = $('#cpURL').val();
        payload['arguments'].execute.inArguments = [{
            "subscriberKey": "{{Contact.Key}}",
            "cloudpageURL": cpURL
        }];
        payload['metaData'].isConfigured = true;
        console.log(payload);
        connection.trigger('updateActivity', payload);
    }
});
