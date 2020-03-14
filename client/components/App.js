import React from "react";
import AudioPlayer from "../containers/AudioPlayer";
import LandingPage from "../containers/LandingPage";
import Loader from "../containers/Loader";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: "LandingPage",
      tracks: ""
    };
    this.callbackFunction = this.callbackFunction.bind(this);
  }

  renderSwitch(currentScreen) {
    switch (currentScreen) {
      case "LandingPage":
        return <LandingPage parentCallback={this.callbackFunction} />;
      case "Loader":
        return <Loader />;
      case "AudioPlayer":
        return <AudioPlayer tracks={this.state.tracks} />;
    }
  }

  callbackFunction(childData, outputData = "") {
    this.setState({ currentScreen: childData, tracks: outputData });
  }

  render() {
    return (
      <div className="App">{this.renderSwitch(this.state.currentScreen)} </div>
    );
  }
}

export default App;
