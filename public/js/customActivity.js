define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    // Configuration variables
    let eventSchema = ''; // variable is used in parseEventSchema()
    let lastnameSchema = ''; // variable is used in parseEventSchema()
    let eventDefinitionKey;

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
        connection.trigger('requestEndpoints');
    }

    /**
     * This function is to pull out the event definition within journey builder.
     * With the eventDefinitionKey, you are able to pull out values that passes through the journey
     */
    connection.trigger('requestTriggerEventDefinition');
    connection.on('requestedTriggerEventDefinition', function (eventDefinitionModel) {
        if (eventDefinitionModel) {
            eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
            // console.log('Request Trigger >>>', JSON.stringify(eventDefinitionModel));
        }
    console.log(eventDefinitionKey);
    });

    function initialize(data) {
        if (data) {
            payload = data;
            console.log(payload);
            var setcpURL = payload['arguments'].execute.inArguments[0].cloudpageURL;
            var teste = "AAA";
//            $('#cpURL').val(setcpURL);
            $('#cpURL').val(teste);
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
