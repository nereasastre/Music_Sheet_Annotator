import { MusicSheet, OpenSheetMusicDisplay, PointF2D } from "opensheetmusicdisplay";
import {
  renderBoundingBoxes,
  cleanSelectBoxes,
  cleanBox,
  cleanAllBoxes,
  initBoxesToNone
} from "./boundingBoxes";
import { mousePosition } from "./utils";

export const musicSheet = new OpenSheetMusicDisplay("musicSheet");
export let currentBox = -1; // initial box = -1 to not render boxes on start
const selectColor = "#b7bbbd";
export let color = selectColor;
export let renderedBoxes = [];

function getLastMeasure(measureList: any){
  return measureList[measureList.length - 1][0].MeasureNumber;
}

(async () => {
  await musicSheet.load("./static/Minuet_in_G_Major.musicxml");
  musicSheet.render();
  let thisMeasureList = musicSheet.GraphicSheet.MeasureList;
  let lastMeasureNumber = getLastMeasure(thisMeasureList);
  let highlightedBoxes = initBoxesToNone(lastMeasureNumber);
  window.localStorage.setItem("Minuet_in_G", JSON.stringify( highlightedBoxes));
})();


function nextBox() {
  let thisMeasureList = musicSheet.GraphicSheet.MeasureList;
  let lastMeasureNumber = getLastMeasure(thisMeasureList);
  currentBox += 1;
  console.log("Current box: ", currentBox);
  cleanSelectBoxes();

  let highlightedBoxes = JSON.parse(window.localStorage.getItem("Minuet_in_G") as string);
  console.log("HIGHLIGHTED BOXES:", highlightedBoxes)
  if (
    highlightedBoxes[currentBox] != color ||
    color === selectColor
  ) {
    renderBoundingBoxes([currentBox], color);
    if (color !== selectColor) {
      highlightedBoxes[currentBox] = color;
      window.localStorage.setItem("Minuet_in_G", JSON.stringify(highlightedBoxes));
    }
    console.log("highlighted boxes:", highlightedBoxes);
  }

  if (currentBox >= lastMeasureNumber) {
    document.getElementById("nextButton").disabled = true;
  }

  if (currentBox > -1) {
    document.getElementById("prevButton").disabled = false;
  }
};

function previousBox() {
  currentBox -= 1;
  console.log("Current box: ", currentBox);
  document.getElementById("nextButton").disabled = false;
  cleanSelectBoxes();
  let highlightedBoxes = JSON.parse(window.localStorage.getItem("Minuet_in_G") as string);

  if (
    highlightedBoxes[currentBox] != color ||
    color === selectColor
  ) {
    cleanBox(currentBox);
    renderBoundingBoxes([currentBox], color);
    if (color !== selectColor) {
      highlightedBoxes[currentBox] = color;
      window.localStorage.setItem("Minuet_in_G", JSON.stringify(highlightedBoxes));
    }
    console.log("highlighted boxes:", highlightedBoxes);
  }
  if (currentBox <= -1) {
    document.getElementById("prevButton").disabled = true;
  }
};


window.onmousedown = function highlightBoxesWithMouse(event: MouseEvent) {
  if (event.shiftKey && color != selectColor) {
    let highlightedBoxes = JSON.parse(window.localStorage.getItem("Minuet_in_G") as string);
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
            highlightedBoxes[measure] = color;
            
          }
        }
      window.localStorage.setItem("Minuet_in_G", JSON.stringify( highlightedBoxes));
      }
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
      window.localStorage.setItem("Minuet_in_G", JSON.stringify( highlightedBoxes));
      break;

    case "Backspace":
      cleanBox(currentBox);
      currentBox -= 1;

      break;

    case "0": // key 0
      color = "#b7bbbd"; // gray
      break;

    case "1": // key 1
      if (color === selectColor) {
        currentBox -= 1;
      }

      color = "#33FF42"; // green (easy)

      break;
    case "2": // key 2
      if (color === selectColor) {
        currentBox -= 1;
      }

      color = "#FFBE33"; // orange (medium)
      break;

    case "3": // key 3
      if (color === selectColor) {
        currentBox -= 1;
      }
      color = "#FF4633"; // red (easy)

      break;

  }
};