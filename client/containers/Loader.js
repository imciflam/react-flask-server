import React, { Component } from "react";

export class Loader extends Component {
  render() {
    return (
      <div className="loader">
        <h1 className="visually-hidden">Loader</h1>
        <div className="loader__container">
          <p className="loader__text">
            Generation of your personal musical recommendations can take up to
            15 seconds.
            <br />
            Please wait...
          </p>
          <svg version="1.2" viewport="0 0 60 60" className="loader__svg">
            <path
              className="loader__pulsar"
              stroke="rgba(0,0,0,0.9)"
              fill="none"
              strokeWidth="1"
              strokeLinejoin="round"
              d="M0,90L250,90Q257,60 262,87T267,95 270,88 273,92t6,35 7,-60T290,127 297,107s2,-11 10,-10 1,1 8,-10T319,95c6,4 8,-6 10,-17s2,10 9,11h210"
            />
          </svg>
        </div>
      </div>
    );
  }
}

export default Loader;
