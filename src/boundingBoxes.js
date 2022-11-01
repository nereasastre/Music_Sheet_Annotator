"use strict";
exports.__esModule = true;
exports.renderBoxAndContinue = exports.initLocalStorageToNone = exports.cleanBox = exports.cleanAllBoxes = exports.cleanSelectBoxes = exports.renderBoundingBoxes = void 0;
var utils_1 = require("./utils");
var index_1 = require("./index");
var utils_2 = require("./utils");
var renderBoundingBoxes = function (numList, color) {
    var thisMeasureList = index_1.musicSheet.GraphicSheet.MeasureList;
    var highlightedBoxes = JSON.parse(window.localStorage.getItem(index_1.scoreName));
    for (var _i = 0, thisMeasureList_1 = thisMeasureList; _i < thisMeasureList_1.length; _i++) {
        var measure = thisMeasureList_1[_i];
        var measureNumber = measure[0].MeasureNumber;
        if ((0, utils_1.checkAvailability)(numList, measureNumber)) {
            for (var staff = 0; staff < measure.length; staff++) {
                var positionAndShape = measure[staff].PositionAndShape;
                var positionAndShape1 = measure[1].PositionAndShape;
                var height = (0, utils_1.convertUnitsToPixels)(4);
                var width = (0, utils_1.convertUnitsToPixels)(positionAndShape.BoundingRectangle.width);
                var x = (0, utils_1.convertUnitsToPixels)(positionAndShape.AbsolutePosition.x);
                var yNew = (0, utils_1.convertUnitsToPixels)(positionAndShape.AbsolutePosition.y);
                var y1 = yNew + height;
                var height1 = (0, utils_1.convertUnitsToPixels)(positionAndShape1.AbsolutePosition.y -
                    positionAndShape.AbsolutePosition.y -
                    4);
                var boundingBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                var boundingBoxMiddle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                boundingBox.setAttribute("fill", color);
                boundingBox.setAttribute("fill-opacity", "0.25");
                boundingBox.setAttribute("x", x.toString());
                boundingBox.setAttribute("y", yNew.toString());
                boundingBox.setAttribute("height", height.toString());
                boundingBox.setAttribute("width", width.toString());
                boundingBox.classList.add("boundingBox");
                boundingBox.classList.add("box".concat(measureNumber.toString()));
                boundingBoxMiddle.setAttribute("fill", color);
                boundingBoxMiddle.setAttribute("fill-opacity", "0.25");
                boundingBoxMiddle.setAttribute("x", x.toString());
                boundingBoxMiddle.setAttribute("y", y1.toString());
                boundingBoxMiddle.setAttribute("height", height1.toString());
                boundingBoxMiddle.setAttribute("width", width.toString());
                boundingBoxMiddle.classList.add("boundingBox");
                boundingBoxMiddle.classList.add("box".concat(measureNumber.toString()));
                document.querySelector("svg").append(boundingBox);
                document.querySelector("svg").append(boundingBoxMiddle);
                if (color === "#b7bbbd") {
                    boundingBox.classList.add("erasableBoundingBox");
                    boundingBoxMiddle.classList.add("erasableBoundingBox");
                }
                else {
                    highlightedBoxes[measureNumber] = utils_2.colorToDifficulty[color];
                }
            }
        }
    }
    window.localStorage.setItem(index_1.scoreName, JSON.stringify(highlightedBoxes));
};
exports.renderBoundingBoxes = renderBoundingBoxes;
var cleanSelectBoxes = function () {
    var boxes = document.querySelectorAll(".erasableBoundingBox");
    boxes.forEach(function (box) {
        box.remove();
    });
};
exports.cleanSelectBoxes = cleanSelectBoxes;
var cleanAllBoxes = function () {
    var boxes = document.querySelectorAll(".boundingBox");
    boxes.forEach(function (box) {
        box.remove();
    });
};
exports.cleanAllBoxes = cleanAllBoxes;
var cleanBox = function (boxNumber) {
    var boxes = document.querySelectorAll(".box".concat(boxNumber.toString()));
    console.log(boxes);
    boxes.forEach(function (box) {
        box.remove();
    });
    var highlightedBoxes = JSON.parse(window.localStorage.getItem(index_1.scoreName));
    highlightedBoxes[boxNumber] = "None";
    window.localStorage.setItem(index_1.scoreName, JSON.stringify(highlightedBoxes));
};
exports.cleanBox = cleanBox;
function initLocalStorageToNone(totalBoxes) {
    var highlightedBoxes = {};
    for (var staff = 0; staff < totalBoxes; staff++) {
        highlightedBoxes[staff] = "None";
    }
    window.localStorage.setItem(index_1.scoreName, JSON.stringify(highlightedBoxes));
    return highlightedBoxes;
}
exports.initLocalStorageToNone = initLocalStorageToNone;
function renderBoxAndContinue(boxNumber, color, lastMeasureNumber) {
    var highlightedBoxes = JSON.parse(window.localStorage.getItem(index_1.scoreName));
    // let lastMeasureNumber =  Object.keys(highlightedBoxes).length;;
    if (color === "#b7bbbd") {
        boxNumber -= 1;
    }
    (0, exports.cleanSelectBoxes)();
    if (highlightedBoxes[boxNumber] != utils_2.colorToDifficulty[color]) {
        (0, exports.cleanBox)(boxNumber);
        (0, exports.renderBoundingBoxes)([boxNumber], color);
    }
    if (boxNumber < lastMeasureNumber) {
        boxNumber += 1;
    }
    else {
        boxNumber = lastMeasureNumber;
    }
    color = "#b7bbbd";
    (0, exports.renderBoundingBoxes)([boxNumber], color);
    return boxNumber;
}
exports.renderBoxAndContinue = renderBoxAndContinue;
//# sourceMappingURL=boundingBoxes.js.map