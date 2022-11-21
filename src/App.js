import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import OpenSheetMusicDisplay from './lib/OpenSheetMusicDisplay'
import {
  renderBoundingBoxes,
  cleanSelectBoxes,
  cleanBox,
  cleanAllBoxes,
  initLocalStorageToNone,
  renderBoxAndContinue
} from "./boundingBoxes";
import { colorToDifficulty, keyToColor, mousePosition } from "./utils";

class App extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { file: "MuzioClementi_SonatinaOpus36No1_Part2.xml" };
    this.divRef = React.createRef();
    this.selectColor = "#b7bbbd";
    this.color = "#b7bbbd";
    this.hideBoundingBoxes = false;
    console.log("APP;", this);
    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
  }

  async initOSMD(){
    this.osmd = this.divRef.current.osmd;
    console.log("OSMD:", this.osmd);
    await new Promise(r => setTimeout(r, 2000)); // wait for osmd to load
    this.measureList = this.osmd.graphic.measureList
    this.currentBox = 1;
    await new Promise(r => setTimeout(r, 2000)); // wait for osmd to load

  }

  async componentDidMount() {
    this.initOSMD();
  }

  componentDidUpdate(prevProps) {
    this.initOSMD();
  }

  handleClick(event) {
    this.currentBox = 1;
    const file = event.target.value;
    this.setState(state => state.file = file);
    this.osmd = this.divRef.current.osmd;
    this.currentBox = 1;
    // renderBoundingBoxes([0], this.selectColor, this.osmd.);
    this.measureList = this.osmd.graphic.measureList;
  }

  selectPreviousBox() {
    this.color = this.selectColor;
    cleanSelectBoxes();
    this.currentBox -= 1;
    console.log("Current box: ", this.currentBox);
    if (this.currentBox <= 1) {
      this.currentBox = 1;
    }
    renderBoundingBoxes([this.currentBox], this.color, this.measureList, this.state.file);
  };

  selectNextBox() {
    this.color = this.selectColor;
    cleanSelectBoxes();
    this.currentBox += 1;
    console.log("Current box: ", this.currentBox);
    renderBoundingBoxes([this.currentBox], this.color, this.measureList, this.state.file);
  
    if (this.currentBox >= this.lastMeasureNumber) {
      this.currentBox = this.lastMeasureNumber;
    }
  };

  handleKeyDown(event) {
    this.lastMeasureNumber = this.measureList[this.measureList.length - 1][0].MeasureNumber;
    if (event.code === "ArrowLeft") {
      if (this.currentBox > 0) {
        this.selectPreviousBox();
        this.hideBoundingBoxes = false;
      }
    }
    else if (event.code === "ArrowRight") {
      if (this.currentBox < this.lastMeasureNumber) {
        this.selectNextBox();
        this.hideBoundingBoxes = false;

      }
    }
    else if (event.code === "Escape"){
      this.currentBox = 1;
      cleanAllBoxes();
      this.color = this.selectColor;
      // let highlightedBoxes = initLocalStorageToNone(lastMeasureNumber);
      // window.localStorage.setItem(scoreName, JSON.stringify( highlightedBoxes));
    }
    else if (event.code === "Backspace"){
      cleanBox(this.currentBox);
      if (this.currentBox > 1){
        cleanSelectBoxes();
        this.currentBox -= 1;
      } else {
        this.currentBox = 1;
      }
      renderBoundingBoxes([this.currentBox], this.selectColor, this.measureList, this.state.file);
  }
  else if (event.code === "Digit1" || event.code === "Numpad1"){
    this.color = keyToColor["1"];
    console.log("COLOR", this.color);
    if (this.currentBox <= this.lastMeasureNumber && !event.shiftKey){
      this.currentBox = renderBoxAndContinue(this.currentBox, this.color, this.measureList, this.state.file);
    }
  }
  else if (event.code === "Digit2" || event.code === "Numpad2"){
    this.color = keyToColor["2"];
    console.log("COLOR", this.color);
    if (this.currentBox <= this.lastMeasureNumber && !event.shiftKey){
      this.currentBox = renderBoxAndContinue(this.currentBox, this.color, this.measureList, this.state.file);
    }
  }
  else if (event.code === "Digit3" || event.code === "Numpad3"){
    this.color = keyToColor["3"];
    console.log("COLOR", this.color);
    if (this.currentBox <= this.lastMeasureNumber && !event.shiftKey){
      this.currentBox = renderBoxAndContinue(this.currentBox, this.color, this.measureList, this.state.file);
    }
  }
  else if (event.code === "KeyH"){
    this.hideBoundingBoxes = !this.hideBoundingBoxes;
    if (this.hideBoundingBoxes) {
      cleanSelectBoxes();
    } else {
      renderBoundingBoxes([this.currentBox], this.selectColor, this.measureList, this.state.file)
    }
  }
}



  render() {
    return (
      <div className="App" onKeyPress={(e) => this.handleKeyPress(e)}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Music Sheet Annotator</h1>
        </header>
        <select onChange={this.handleClick.bind(this)}>
          <option value="MuzioClementi_SonatinaOpus36No1_Part2.xml">Muzio Clementi: Sonatina Opus 36 No1 Part2</option>
          <option value="Beethoven_AnDieFerneGeliebte.xml">Beethoven: An Die Ferne Geliebte</option>
          <option value="070-1-Sam-003.xml">070-1-Sam-003</option>

        </select>
        <div id="music-sheet" >

        </div>

        <OpenSheetMusicDisplay file={this.state.file} ref={this.divRef} />

      </div>
    );
  }
}

export default App;
