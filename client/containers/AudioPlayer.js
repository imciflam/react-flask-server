import React, { Component } from "react";

export class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      currentTrack: 0,
      paused: true
    };
  }

  componentDidMount() {
    window.myRefParam = this.myRef.current;
    window.currentTrackParam = this.state.currentTrack;
    window.addEventListener("beforeunload", event => {
      event.preventDefault();
      if (event.currentTarget.myRefParam) {
        this.setLocalStorage(
          event.currentTarget.currentTrackParam,
          event.currentTarget.myRefParam
        );
      }
    });
    console.log(this.myRef.current);
    this.myRef.current.addEventListener("pause", () => {
      this.setState({ paused: true });
    });
  }

  setLocalStorage(key, old) {
    if (old.played.length !== 0) {
      let stringKey = key.toString();
      let timeListened = old.played.end(0).toString();
      if (localStorage.getItem(stringKey) === null) {
        localStorage.setItem(stringKey, timeListened);
      } else {
        let currValue = localStorage.getItem(stringKey);
        localStorage.setItem(stringKey, currValue + "," + timeListened);
      }
    }
  }

  switchTrack(key, old) {
    this.setLocalStorage(this.state.currentTrack, old);
    const node = this.myRef.current;
    node.load();
    node.play();
    this.setState({ currentTrack: key, paused: false });
  }

  render() {
    return (
      <div className="audioplayer">
        <h1 className="visually-hidden">AudioPlayer</h1>
        <div className="audioplayer__title">
          <p className="audioplayer__title--name">
            {this.props.tracks[this.state.currentTrack][1]}
          </p>
          <p className="audioplayer__title--artist">
            {this.props.tracks[this.state.currentTrack][0]}
          </p>
        </div>
        <div className="audioplayer-container">
          <div className="audioplayer__cover">
            <img
              className="audioplayer__image"
              src={this.props.tracks[this.state.currentTrack][3]}
              alt="audioplayer image"
            />
          </div>
          <ul className="audioplayer__list">
            {this.props.tracks.map(element => {
              return (
                <li
                  key={this.props.tracks.indexOf(element)}
                  className={
                    this.props.tracks.indexOf(element) ==
                    this.state.currentTrack
                      ? "audioplayer__item--active"
                      : "audioplayer__item"
                  }
                  onClick={() => {
                    this.switchTrack(
                      this.props.tracks.indexOf(element),
                      this.myRef.current
                    );
                  }}
                >
                  {this.props.tracks.indexOf(element) ===
                    this.state.currentTrack &&
                  this.myRef.current !== null &&
                  !this.state.paused ? (
                    <svg
                      className="audioplayer__svg"
                      width="12"
                      height="12"
                      viewBox="0 0 55 10"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#303030"
                    >
                      <g transform="matrix(1 0 0 -2 0 35)">
                        <rect width="12" height="15" rx="1">
                          <animate
                            attributeName="height"
                            begin="0s"
                            dur="4.3s"
                            values="20;12;23;5;13;24;13;24;2;23;30;20;"
                            calcMode="linear"
                            repeatCount="indefinite"
                          />
                        </rect>
                        <rect x="15" width="12" height="30" rx="1">
                          <animate
                            attributeName="height"
                            begin="0s"
                            dur="2s"
                            values="30;23;5;15;23;30;12;14;22;10;30;"
                            calcMode="linear"
                            repeatCount="indefinite"
                          />
                        </rect>
                        <rect x="30" width="12" height="20" rx="1">
                          <animate
                            attributeName="height"
                            begin="0s"
                            dur="2s"
                            values="30;13;24;13;30;12;23;5;15;23;30;"
                            calcMode="linear"
                            repeatCount="indefinite"
                          />
                        </rect>
                      </g>
                    </svg>
                  ) : (
                    <span className="audioplayer__tracknumber">
                      {this.props.tracks.indexOf(element) + 1}
                    </span>
                  )}
                  {/*<p className="audioplayer__artist">{element[0]}</p>*/}
                  <p className="audioplayer__name">{element[1]}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="audioplayer__audio-container">
          <audio ref={this.myRef} className="audioplayer__audio-kit" controls>
            <source src={this.props.tracks[this.state.currentTrack][2]} />
          </audio>
        </div>
      </div>
    );
  }
}

export default AudioPlayer;
