import { NuimoEventMessage, NuimoGesture, NuimoShowProgressBarIconCommand, NuimoProgressBarStyle } from "../app/nuimoMqttMessages";
import assert = require("assert");
import mocha = require("mocha")

describe('NuimoShowProgressBarIconCommand', function() {
    it('should parse json well', function() {

        var testObject = new NuimoShowProgressBarIconCommand(0.77, NuimoProgressBarStyle.VolumeBar, 0.9, 0.3);
        var parsedJson = roundtripJson(testObject);
        var deserializedObject = new NuimoShowProgressBarIconCommand().deserialize(parsedJson);
        
        assert.deepEqual(testObject, deserializedObject, "deserializedObject is equal to testObject");
    });
});

describe('NuimoEventMessage', function() {
    it('should parse json well', function() {

        var testObject = new NuimoEventMessage(NuimoGesture.ButtonPress);
        var parsedJson = roundtripJson(testObject);
        var deserializedObject = new NuimoEventMessage().deserialize(parsedJson);
        
        assert.deepEqual(testObject, deserializedObject, "deserializedObject is equal to testObject");
    });
});



function roundtripJson(input: any): any{
    var jsonString = JSON.stringify(input);
    var parsedJson = JSON.parse(jsonString);
    
    return parsedJson;
}