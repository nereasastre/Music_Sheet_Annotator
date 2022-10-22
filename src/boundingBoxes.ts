import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { convertUnitsToPixels, checkAvailability } from "./utils";
import { musicSheet, currentBox } from "./index";

export const renderBoundingBoxes = (numList: Array<number>, color: string) => {
  let thisMeasureList = musicSheet.GraphicSheet.MeasureList;

  for (const measure of thisMeasureList) {
    if (checkAvailability(numList, measure[0].MeasureNumber)) {
      for (let staff = 0; staff < measure.length; staff++) {
        console.log("measure number", measure[0].MeasureNumber);
        const positionAndShape = measure[staff].PositionAndShape;
        const positionAndShape1 = measure[1].PositionAndShape;
        const height = convertUnitsToPixels(4);
        const width = convertUnitsToPixels(
          positionAndShape.BoundingRectangle.width
        );
        const x = convertUnitsToPixels(positionAndShape.AbsolutePosition.x);
        const yNew = convertUnitsToPixels(positionAndShape.AbsolutePosition.y);
        const y1 = yNew + height;
        const height1 = convertUnitsToPixels(
          positionAndShape1.AbsolutePosition.y -
            positionAndShape.AbsolutePosition.y -
            4
        );

        const boundingBox = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        const boundingBoxMiddle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        boundingBox.setAttribute("fill", color);
        boundingBox.setAttribute("fill-opacity", "0.25");
        boundingBox.setAttribute("x", x.toString());
        boundingBox.setAttribute("y", yNew.toString());
        boundingBox.setAttribute("height", height.toString());
        boundingBox.setAttribute("width", width.toString());
        boundingBox.classList.add("boundingBox");
        boundingBox.classList.add("box".concat(currentBox.toString()));

        boundingBoxMiddle.setAttribute("fill", color);
        boundingBoxMiddle.setAttribute("fill-opacity", "0.25");
        boundingBoxMiddle.setAttribute("x", x.toString());
        boundingBoxMiddle.setAttribute("y", y1.toString());
        boundingBoxMiddle.setAttribute("height", height1.toString());
        boundingBoxMiddle.setAttribute("width", width.toString());
        boundingBoxMiddle.classList.add("boundingBoxMiddle");
        boundingBoxMiddle.classList.add("box".concat(currentBox.toString()));


        document.querySelector("svg")!.append(boundingBox);
        document.querySelector("svg")!.append(boundingBoxMiddle);

        if (color === "#b7bbbd") {
          boundingBox.classList.add("erasableBoundingBox");
          boundingBoxMiddle.classList.add("erasableBoundingBoxMiddle");
        }
      }
    }
  }
};

export const cleanSelectBoxes = () => {
  const boxes = document.querySelectorAll(".erasableBoundingBox");
  const middleBoxes = document.querySelectorAll(".erasableBoundingBoxMiddle");
  boxes.forEach((box) => {
    box.remove();
  });

  middleBoxes.forEach((middleBox) => {
    middleBox.remove();
  });
};

export const cleanAllBoxes = () => {
  const boxes = document.querySelectorAll(".boundingBox");
  const middleBoxes = document.querySelectorAll(".boundingBoxMiddle");
  boxes.forEach((box) => {
    box.remove();
  });

  middleBoxes.forEach((middleBox) => {
    middleBox.remove();
  });
};

export const cleanBox = (boxNumber: number) => {
  const boxes = document.querySelectorAll(".box".concat(boxNumber.toString()));
  console.log(boxes);
  boxes.forEach((box) => {
    box.remove();
  });
  let highlightedBoxes = JSON.parse(window.localStorage.getItem("Minuet_in_G") as string);
  highlightedBoxes[boxNumber] = "None";
  window.localStorage.setItem("Minuet_in_G", JSON.stringify( highlightedBoxes));
};

export function initBoxesToNone(totalBoxes: number){
  let highlightedBoxes: { [id: number]: string } = {};

  for (let staff = 0; staff < totalBoxes; staff++) {
    highlightedBoxes[staff] = "None";
  }
  return highlightedBoxes;
}
