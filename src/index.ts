import { MusicSheet, OpenSheetMusicDisplay, PointF2D } from "opensheetmusicdisplay";
import {
  renderBoundingBoxes,
  cleanSelectBoxes,
  cleanBox,
  cleanAllBoxes,
  initLocalStorageToNone,
  renderBoxAndContinue
} from "./boundingBoxes";
import { keyToColor, mousePosition } from "./utils";

const selectColor = "#b7bbbd";
export const musicSheet = new OpenSheetMusicDisplay("musicSheet");
export let currentBox = 0; // initial box = -1 to not render boxes on start
export let color = selectColor;
export const scoreName = "Minuet_in_G";


function getLastMeasure(measureList: any){
  return measureList[measureList.length - 1][0].MeasureNumber;
}

(async () => {
  await musicSheet.load("./static/Minuet_in_G_Major.musicxml");
  musicSheet.render();
  let thisMeasureList = musicSheet.GraphicSheet.MeasureList;
  let lastMeasureNumber = getLastMeasure(thisMeasureList);
  initLocalStorageToNone(lastMeasureNumber);
  renderBoundingBoxes([currentBox], color);  // render box 0 in gray on start
})();


function selectNextBox() {
  color = selectColor;
  let thisMeasureList = musicSheet.GraphicSheet.MeasureList;
  let lastMeasureNumber = getLastMeasure(thisMeasureList);
  cleanSelectBoxes();
  
  currentBox += 1;
  console.log("Current box: ", currentBox);

  renderBoundingBoxes([currentBox], color);

  if (currentBox >= lastMeasureNumber) {
    currentBox = lastMeasureNumber;
  }

};

function selectPreviousBox() {
  color = selectColor;
  cleanSelectBoxes();
  currentBox -= 1;
  console.log("Current box: ", currentBox);
  if (currentBox < -1) {
    currentBox = 0;
  }
  renderBoundingBoxes([currentBox], color);

};


window.onmousedown = function highlightBoxesWithMouse(event: MouseEvent) {
  if (event.shiftKey && color !== "#b7bbbd") {

    cleanSelectBoxes();

    let highlightedBoxes = JSON.parse(window.localStorage.getItem(scoreName) as string);
    let initPos = mousePosition(event);
    let maxDist = new PointF2D(5, 5);

    let initNearestNote = musicSheet.GraphicSheet.GetNearestNote(
      initPos,
      maxDist
    );
    let initMeasure = initNearestNote.sourceNote.SourceMeasure.MeasureNumber;

    onmouseup = (event) => {
      if (event.shiftKey) {

        let finalPos = mousePosition(event);
        let finalNearestNote = musicSheet.GraphicSheet.GetNearestNote(
          finalPos,
          maxDist
        );
        let finalMeasure =
          finalNearestNote.sourceNote.SourceMeasure.MeasureNumber;
        if (finalMeasure < initMeasure) {  // if selection is from right to left, swap init and final
          const previousFinalMeasure = finalMeasure;
          finalMeasure = initMeasure;
          initMeasure = previousFinalMeasure;
        }
        currentBox = finalMeasure;
        for (let measure = initMeasure; measure < finalMeasure + 1; measure++) {
          if (highlightedBoxes[measure] != color) {
            cleanBox(measure);
            renderBoundingBoxes([measure], color);            
          }
        }
      }
      currentBox += 1;
      color = "#b7bbbd"
      renderBoundingBoxes([currentBox], color)
    };
  } else {
    return;
  }
};


document.onkeydown = function (e) {
  let thisMeasureList = musicSheet.GraphicSheet.MeasureList;
  let lastMeasureNumber =
    thisMeasureList[thisMeasureList.length - 1][0].MeasureNumber;

  switch (e.key) {
    case "ArrowLeft": 
      if (currentBox > -1) {
        selectPreviousBox();
      }
      break;
    case "ArrowRight": 
      if (currentBox < lastMeasureNumber) {
        selectNextBox();
      }
      break;
    case "Escape":
      currentBox = 0;
      cleanAllBoxes();
      color = selectColor;
      let highlightedBoxes = initLocalStorageToNone(lastMeasureNumber);
      window.localStorage.setItem(scoreName, JSON.stringify( highlightedBoxes));
      break;

    case "Backspace":
      cleanSelectBoxes();
      cleanBox(currentBox);
      currentBox -= 1;

      color = selectColor;
      renderBoundingBoxes([currentBox], selectColor);

      break;

    case "1": // key 1    
      case "2": // key 2
        case "3": // key 3
          color = keyToColor[e.key];
          currentBox = renderBoxAndContinue(currentBox, color);
    break;

  }
};