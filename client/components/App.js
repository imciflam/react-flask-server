import React from "react";
import LoginButton from "./LoginButton";
import SpotifyAuth from "./SpotifyAuth";
import ManualInput from "./ManualInput";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <LoginButton />
        <SpotifyAuth />
        <ManualInput />
      </div>
    );
  }
}

export default App;
