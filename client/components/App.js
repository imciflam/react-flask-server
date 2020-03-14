import React from "react";
import LandingPage from "../containers/LandingPage";
import Loader from "../containers/Loader";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: "LandingPage"
    };
    this.callbackFunction = this.callbackFunction.bind(this);
  }

  renderSwitch(currentScreen) {
    switch (currentScreen) {
      case "LandingPage":
        return <LandingPage parentCallback={this.callbackFunction} />;
      case "Loader":
        return <Loader />;
    }
  }

  callbackFunction(childData) {
    this.setState({ currentScreen: childData });
  }

  render() {
    console.log(this.state);
    return (
      <div className="App">{this.renderSwitch(this.state.currentScreen)} </div>
    );
  }
}

export default App;
