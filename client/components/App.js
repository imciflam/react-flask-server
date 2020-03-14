import React from "react";
import SpotifyAuth from "./SpotifyAuth";
import ManualInput from "./ManualInput";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <SpotifyAuth />
        <ManualInput />
      </div>
    );
  }
}

export default App;
