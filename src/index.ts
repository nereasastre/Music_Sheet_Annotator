import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import {
  renderBoundingBoxes,
  cleanSelectBoxes,
  cleanAllBoxes
} from "./boundingBoxes";
import { mousePosition } from "./utils";

export const musicSheet = new OpenSheetMusicDisplay("musicSheet");
export let currentBox = -1; // initial box = -1 to not render boxes on start
const selectColor = "#b7bbbd";
export let color = selectColor;
export let highlightedBoxes = [];

(async () => {
  await musicSheet.load("./static/Minuet_in_G_Major.musicxml");
  musicSheet.render();
})();

window.nextBox = function nextBox() {
  let thisMeasureList = musicSheet.GraphicSheet.MeasureList;
  let lastMeasureNumber =
    thisMeasureList[thisMeasureList.length - 1][0].MeasureNumber;

  currentBox += 1;
  console.log("Current box: ", currentBox);
  cleanSelectBoxes();
  if (
    highlightedBoxes.includes(currentBox) === false ||
    color === selectColor
  ) {
    renderBoundingBoxes([currentBox], color);
    if (color !== selectColor) {
      highlightedBoxes.push(currentBox);
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

window.previousBox = function previousBox() {
  currentBox -= 1;
  console.log("Current box: ", currentBox);
  document.getElementById("nextButton").disabled = false;
  cleanSelectBoxes();
  if (
    highlightedBoxes.includes(currentBox) === false ||
    color === selectColor
  ) {
    renderBoundingBoxes([currentBox], color);
    if (color !== selectColor) {
      highlightedBoxes.push(currentBox);
    }
    console.log("highlighted boxes:", highlightedBoxes);
  }
  if (currentBox <= -1) {
    document.getElementById("prevButton").disabled = true;
  }
};

document.onkeydown = function (e) {
  let thisMeasureList = musicSheet.GraphicSheet.MeasureList;
  let lastMeasureNumber =
    thisMeasureList[thisMeasureList.length - 1][0].MeasureNumber;

  switch (e.keyCode) {
    case 37: // left arrow
      if (currentBox > -1) {
        previousBox();
      }
      break;
    case 39: // right arrow
      if (currentBox < lastMeasureNumber) {
        nextBox();
      }
      break;
    case 8: // backspace
      currentBox = -1;
      cleanAllBoxes();

      break;

    case 48:
    case 96: // key 0
      if (color === selectColor) {
        currentBox -= 1;
      }
      color = "#b7bbbd"; // gray
      break;
    case 49:
    case 97: // key 1
      if (color === selectColor) {
        currentBox -= 1;
      }

      color = "#33FF42"; // green (easy)

      break;
    case 50:
    case 98: // key 2
      if (color === selectColor) {
        currentBox -= 1;
      }

      color = "#FFBE33"; // orange (medium)
      break;

    case 51:
    case 99: // key 3
      if (color === selectColor) {
        currentBox -= 1;
      }
      color = "#FF4633"; // red (easy)

      break;

    //case 52 || 100: // key 4
    // clickMode = !clickMode;
    // break;
  }
};

window.onmousedown = function highlightBoxesWithMouse(event: MouseEvent) {
  if (event.shiftKey && color != selectColor) {
    cleanSelectBoxes();
    let initPos = mousePosition(event);
    let maxDist = { x: 5, y: 5 };
    // let osmdPoint = musicSheet.GraphicSheet.svgToOsmd(clickPointF2D);

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
          if (highlightedBoxes.includes(measure) === false) {
            renderBoundingBoxes([measure], color);
            if (color !== selectColor) {
              highlightedBoxes.push(measure);
            }
          }
        }

        console.log(initPos, finalPos);
      }
    };
  } else {
    return;
  }
};
