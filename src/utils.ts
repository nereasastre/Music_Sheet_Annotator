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

  let yScroll = 0;
  onscroll = (event) => {
    yScroll = window.scrollY;
  };
  console.log("scroll: ", yScroll);
  const xpos = event.clientX / units;
  const ypos = (event.clientY + yScroll) / units;
  return { x: xpos, y: ypos };
}
