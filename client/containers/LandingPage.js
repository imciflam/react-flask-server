import React, { Component } from "react";
import SpotifyAuth from "../components/SpotifyAuth";
import ManualInput from "../components/ManualInput";

export class LandingPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="landing">
        <div className="landing__container">
          <SpotifyAuth parentCallback={this.props.parentCallback} />
          <ManualInput parentCallback={this.props.parentCallback} />
        </div>
      </div>
    );
  }
}

export default LandingPage;
