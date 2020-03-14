import React, { Component } from "react";

export class SpotifyAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: true
    };
  }

  render() {
    return (
      <div>
        <h1>SpotifyAuth</h1>
      </div>
    );
  }
}

export default SpotifyAuth;
