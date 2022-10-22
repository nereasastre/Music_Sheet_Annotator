import { MusicSheet, OpenSheetMusicDisplay, PointF2D } from "opensheetmusicdisplay";
import {
  renderBoundingBoxes,
  cleanSelectBoxes,
  cleanBox,
  cleanAllBoxes,
  initBoxesToNone,
  cleanAndRender
} from "./boundingBoxes";
import { mousePosition } from "./utils";

export const musicSheet = new OpenSheetMusicDisplay("musicSheet");
export let currentBox = 0; // initial box = -1 to not render boxes on start
const selectColor = "#b7bbbd";
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
  initBoxesToNone(lastMeasureNumber);
  renderBoundingBoxes([currentBox], color);  // render box 0 in gray on start
})();


function nextBox() {
  color = selectColor;
  let thisMeasureList = musicSheet.GraphicSheet.MeasureList;
  let lastMeasureNumber = getLastMeasure(thisMeasureList);
  console.log("Current box: ", currentBox);
  cleanSelectBoxes();
  currentBox += 1;

  renderBoundingBoxes([currentBox], color);

  if (currentBox >= lastMeasureNumber) {
    // document.getElementById("nextButton").disabled = true;
    currentBox = lastMeasureNumber;
  }

  //if (currentBox > -1) {
  //document.getElementById("prevButton").disabled = false;
  //}
};

function previousBox() {
  color = selectColor;
  currentBox -= 1;
  console.log("Current box: ", currentBox);
  // document.getElementById("nextButton").disabled = false;
  if (currentBox < -1) {
    currentBox = 0;
    //document.getElementById("prevButton").disabled = true;
  }
  cleanSelectBoxes();
  let highlightedBoxes = JSON.parse(window.localStorage.getItem(scoreName) as string);
  renderBoundingBoxes([currentBox], color);
    console.log("highlighted boxes:", highlightedBoxes);

};


window.onmousedown = function highlightBoxesWithMouse(event: MouseEvent) {
  if (event.shiftKey && color != selectColor) {
    let highlightedBoxes = JSON.parse(window.localStorage.getItem(scoreName) as string);
    cleanSelectBoxes();
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
        if (finalMeasure < initMeasure) {
          const previousFinalMeasure = finalMeasure;
          finalMeasure = initMeasure;
          initMeasure = previousFinalMeasure;
        }
        currentBox = finalMeasure;
        for (let measure = initMeasure; measure < finalMeasure + 1; measure++) {
          if (highlightedBoxes[measure] != color) {
            renderBoundingBoxes([measure], color);            
          }
        }
      }
      currentBox += 1;
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
        previousBox();
      }
      break;
    case "ArrowRight": 
      if (currentBox < lastMeasureNumber) {
        nextBox();
      }
      break;
    case "Escape":
      currentBox = -1;
      cleanAllBoxes();
      color = selectColor;
      let highlightedBoxes = initBoxesToNone(lastMeasureNumber);
      window.localStorage.setItem(scoreName, JSON.stringify( highlightedBoxes));
      break;

    case "Backspace":
      currentBox -= 1;
      cleanBox(currentBox);

      break;

    case "0": // key 0
      color = "#b7bbbd"; // gray
      break;

    case "1": // key 1    
      color = "#33FF42"; // green (easy)
      currentBox = cleanAndRender(currentBox, color);
      break;

    case "2": // key 2
      color = "#FFBE33"; // orange (medium)
      currentBox = cleanAndRender(currentBox, color);
      break;

    case "3": // key 3
      color = "#FF4633"; // red (easy)
      currentBox = cleanAndRender(currentBox, color);
      break;

  }
};