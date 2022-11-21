import React, { Component } from "react";
import { OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";

class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { dataReady: true };
    this.osmd = undefined;
    this.divRef = React.createRef();
  }

  setupOsmd() {
    const options = {
      autoResize:
        this.props.autoResize !== undefined ? this.props.autoResize : true,
      drawTitle:
        this.props.drawTitle !== undefined ? this.props.drawTitle : true
    };
    this.osmd = new OSMD(this.divRef.current, options);
    this.osmd.load(this.props.file).then(() => this.osmd.render());
  }

  resize() {
    this.forceUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  componentDidUpdate(prevProps) {
    if (this.props.drawTitle !== prevProps.drawTitle) {
      this.setupOsmd();
      console.log(this.osmd)
    } else {
      this.osmd.load(this.props.file).then(() => this.osmd.render());
      console.log(this.osmd)

    }
    window.addEventListener("resize", this.resize);
  }

  // Called after render
  componentDidMount() {
    console.log("ENTERED");
    this.setupOsmd();
  }

  render() {
    return <div ref={this.divRef} />;
  }
}

export default OpenSheetMusicDisplay;
