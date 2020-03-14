import React, { Component } from "react";
import SpotifyAuth from "../components/SpotifyAuth";
import ManualInput from "../components/ManualInput";

export class LandingPage extends Component {
  render() {
    return (
      <div className="landing">
        <div className="landing__container">
          <SpotifyAuth />
          <ManualInput />
        </div>
      </div>
    );
  }
}

export default LandingPage;
