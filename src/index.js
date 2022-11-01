"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.scoreName = exports.color = exports.currentBox = exports.musicSheet = void 0;
var opensheetmusicdisplay_1 = require("opensheetmusicdisplay");
var boundingBoxes_1 = require("./boundingBoxes");
var utils_1 = require("./utils");
var selectColor = "#b7bbbd";
exports.musicSheet = new opensheetmusicdisplay_1.OpenSheetMusicDisplay("musicSheet");
exports.currentBox = 0; // initial box = -1 to not render boxes on start
exports.color = selectColor;
exports.scoreName = "Minuet_in_G";
var hideBoundingBoxes = false;
function getLastMeasure(measureList) {
    return measureList[measureList.length - 1][0].MeasureNumber;
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var thisMeasureList, lastMeasureNumber;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.musicSheet.load("./static/Minuet_in_G_Major.musicxml")];
            case 1:
                _a.sent();
                exports.musicSheet.render();
                thisMeasureList = exports.musicSheet.GraphicSheet.MeasureList;
                lastMeasureNumber = getLastMeasure(thisMeasureList);
                (0, boundingBoxes_1.initLocalStorageToNone)(lastMeasureNumber);
                (0, boundingBoxes_1.renderBoundingBoxes)([exports.currentBox], exports.color); // render box 0 in gray on start
                return [2 /*return*/];
        }
    });
}); })();
function selectNextBox() {
    exports.color = selectColor;
    var thisMeasureList = exports.musicSheet.GraphicSheet.MeasureList;
    var lastMeasureNumber = getLastMeasure(thisMeasureList);
    (0, boundingBoxes_1.cleanSelectBoxes)();
    exports.currentBox += 1;
    console.log("Current box: ", exports.currentBox);
    (0, boundingBoxes_1.renderBoundingBoxes)([exports.currentBox], exports.color);
    if (exports.currentBox >= lastMeasureNumber) {
        exports.currentBox = lastMeasureNumber;
    }
}
;
function selectPreviousBox() {
    exports.color = selectColor;
    (0, boundingBoxes_1.cleanSelectBoxes)();
    exports.currentBox -= 1;
    console.log("Current box: ", exports.currentBox);
    if (exports.currentBox <= 0) {
        exports.currentBox = 0;
    }
    (0, boundingBoxes_1.renderBoundingBoxes)([exports.currentBox], exports.color);
}
;
window.onmousedown = function highlightBoxesWithMouse(event) {
    if (event.shiftKey && exports.color != "#b7bbbd") {
        console.log(exports.color);
        (0, boundingBoxes_1.cleanSelectBoxes)();
        var highlightedBoxes_1 = JSON.parse(window.localStorage.getItem(exports.scoreName));
        var initPos = (0, utils_1.mousePosition)(event);
        var maxDist_1 = new opensheetmusicdisplay_1.PointF2D(5, 5);
        var initNearestNote = exports.musicSheet.GraphicSheet.GetNearestNote(initPos, maxDist_1);
        var initMeasure_1 = initNearestNote.sourceNote.SourceMeasure.MeasureNumber;
        onmouseup = function (event) {
            if (exports.color == "#b7bbbd") {
                return;
            }
            if (event.shiftKey) {
                var finalPos = (0, utils_1.mousePosition)(event);
                var finalNearestNote = exports.musicSheet.GraphicSheet.GetNearestNote(finalPos, maxDist_1);
                var finalMeasure = finalNearestNote.sourceNote.SourceMeasure.MeasureNumber;
                if (finalMeasure < initMeasure_1) { // if selection is from right to left, swap init and final
                    var previousFinalMeasure = finalMeasure;
                    finalMeasure = initMeasure_1;
                    initMeasure_1 = previousFinalMeasure;
                }
                exports.currentBox = finalMeasure;
                for (var measure = initMeasure_1; measure < finalMeasure + 1; measure++) {
                    if (highlightedBoxes_1[measure] != utils_1.colorToDifficulty[exports.color]) {
                        (0, boundingBoxes_1.cleanBox)(measure);
                        (0, boundingBoxes_1.renderBoundingBoxes)([measure], exports.color);
                    }
                }
            }
            exports.currentBox += 1;
            (0, boundingBoxes_1.renderBoundingBoxes)([exports.currentBox], selectColor);
        };
    }
    else {
        return;
    }
};
document.onkeydown = function (e) {
    var thisMeasureList = exports.musicSheet.GraphicSheet.MeasureList;
    var lastMeasureNumber = thisMeasureList[thisMeasureList.length - 1][0].MeasureNumber;
    if (e.code == "ArrowLeft") {
        if (exports.currentBox > -1) {
            selectPreviousBox();
            hideBoundingBoxes = false;
        }
    }
    else if (e.code == "ArrowRight") {
        if (exports.currentBox < lastMeasureNumber) {
            selectNextBox();
            hideBoundingBoxes = false;
        }
    }
    else if (e.code == "Escape") {
        exports.currentBox = 0;
        (0, boundingBoxes_1.cleanAllBoxes)();
        exports.color = selectColor;
        var highlightedBoxes = (0, boundingBoxes_1.initLocalStorageToNone)(lastMeasureNumber);
        window.localStorage.setItem(exports.scoreName, JSON.stringify(highlightedBoxes));
    }
    else if (e.code == "Backspace") {
        (0, boundingBoxes_1.cleanBox)(exports.currentBox);
        if (exports.currentBox > 0) {
            (0, boundingBoxes_1.cleanSelectBoxes)();
            exports.currentBox -= 1;
        }
        else {
            exports.currentBox = 0;
        }
        exports.color = selectColor;
        (0, boundingBoxes_1.renderBoundingBoxes)([exports.currentBox], selectColor);
    }
    else if (e.code == "Digit1" || e.code == "Numpad1") {
        exports.color = utils_1.keyToColor["1"];
        if (exports.currentBox <= lastMeasureNumber && !e.shiftKey) {
            exports.currentBox = (0, boundingBoxes_1.renderBoxAndContinue)(exports.currentBox, exports.color, lastMeasureNumber);
        }
    }
    else if (e.code == "Digit2" || e.code == "Numpad2") {
        exports.color = utils_1.keyToColor["2"];
        if (exports.currentBox <= lastMeasureNumber && !e.shiftKey) {
            exports.currentBox = (0, boundingBoxes_1.renderBoxAndContinue)(exports.currentBox, exports.color, lastMeasureNumber);
        }
    }
    else if (e.code == "Digit3" || e.code == "Numpad3") {
        exports.color = utils_1.keyToColor["3"];
        if (exports.currentBox <= lastMeasureNumber && !e.shiftKey) {
            exports.currentBox = (0, boundingBoxes_1.renderBoxAndContinue)(exports.currentBox, exports.color, lastMeasureNumber);
        }
    }
    else if (e.code == "KeyH") {
        hideBoundingBoxes = !hideBoundingBoxes;
        if (hideBoundingBoxes) {
            (0, boundingBoxes_1.cleanSelectBoxes)();
        }
        else {
            (0, boundingBoxes_1.renderBoundingBoxes)([exports.currentBox], selectColor);
        }
    }
};
//# sourceMappingURL=index.js.map