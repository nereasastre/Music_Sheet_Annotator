"use strict";
exports.__esModule = true;
exports.colorToDifficulty = exports.keyToColor = exports.mousePosition = exports.mousePosition1 = exports.checkAvailability = exports.convertUnitsToPixels = void 0;
var opensheetmusicdisplay_1 = require("opensheetmusicdisplay");
var convertUnitsToPixels = function (units) { return units * 10; };
exports.convertUnitsToPixels = convertUnitsToPixels;
function checkAvailability(arr, val) {
    return arr.some(function (arrVal) {
        return val === arrVal;
    });
}
exports.checkAvailability = checkAvailability;
function mousePosition1(event) {
    var units = 10;
    var xpos = event.clientX / units;
    var ypos = event.clientY / units;
    return { x: xpos, y: ypos };
}
exports.mousePosition1 = mousePosition1;
function mousePosition(event) {
    var units = 10;
    var xpos = event.pageX / units;
    var ypos = (event.pageY) / units;
    return new opensheetmusicdisplay_1.PointF2D(xpos, ypos);
}
exports.mousePosition = mousePosition;
exports.keyToColor = { "1": "#33FF42", "2": "#FFBE33", "3": "#FF4633" };
exports.colorToDifficulty = { "#33FF42": "easy", "#FFBE33": "medium", "#FF4633": "hard" };
//# sourceMappingURL=utils.js.map