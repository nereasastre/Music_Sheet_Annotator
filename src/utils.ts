import { PointF2D } from "opensheetmusicdisplay";

export const convertUnitsToPixels = (units: number) => units * 10;
export function checkAvailability(arr: Array<number>, val: number) {
  return arr.some(function (arrVal) {
    return val === arrVal;
  });
}
export function mousePosition1(event: MouseEvent) {
  let units = 10;
  let xpos = event.clientX / units;
  let ypos = event.clientY / units;
  return { x: xpos, y: ypos };
}

export function mousePosition(event: MouseEvent) {
  const units = 10;
  const xpos = event.pageX / units;
  const ypos = (event.pageY) / units;
  return new PointF2D(xpos, ypos);
}

export let keyToColor: { [id: string]: string } = {"1": "#33FF42", "2": "#FFBE33", "3": "#FF4633"};
export let colorToDifficulty: { [id: string]: string } = {"#33FF42": "easy", "#FFBE33": "medium", "#FF4633": "hard"};



