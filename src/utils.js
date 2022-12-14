import { PointF2D } from "opensheetmusicdisplay";

export const convertUnitsToPixels = (units) => units * 10;
export function checkAvailability(arr, val) {
  return arr.some(function (arrVal) {
    return val === arrVal;
  });
}
export function mousePosition1(event) {
  let units = 10;
  let xpos = event.clientX / units;
  let ypos = event.clientY / units;
  return { x: xpos, y: ypos };
}

export function mousePosition(event) {
  const units = 10;
  const xpos = event.pageX / units; 
  const ypos = (event.pageY - 200) / units;  // Subtract the pixels corresponding to the page header 
  return new PointF2D(xpos, ypos);
}

export function max(a, b){
  if (a > b){
    return a;
  }
  return b;
}

export let keyToColor = {"1": "#33FF42", "2": "#FFBE33", "3": "#FF4633"};
export let colorToDifficulty = {"#33FF42": "easy", "#FFBE33": "medium", "#FF4633": "hard"};
export let difficultyToColor = {"easy": "#33FF42", "medium": "#FFBE33", "hard": "#FF4633"};

