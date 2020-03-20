import React, { Component } from "react";

export class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      currentTrack: 0
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
  }

  setLocalStorage(key, old) {
    if (old.played.length !== 0) {
      let stringKey = key.toString();
      let timeListened = old.played.end(0).toString();
      if (localStorage.getItem(stringKey) === null) {
        localStorage.setItem(stringKey, timeListened);
      } else {
        let currValue = localStorage.getItem(stringKey);
        localStorage.setItem(stringKey, currValue + ";" + timeListened);
      }
    }
  }

  switchTrack(key, old) {
    this.setLocalStorage(key, old);
    this.setState({ currentTrack: key });
    const node = this.myRef.current;
    node.load();
  }

  render() {
    return (
      <div className="audioplayer">
        <h1 className="visually-hidden">AudioPlayer</h1>
        <div className="audioplayer__title">
          <p className="audioplayer__title--name">
            {this.props.tracks[this.state.currentTrack][1]}{" "}
          </p>
          <p className="audioplayer__title--artist">
            {this.props.tracks[this.state.currentTrack][0]}{" "}
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
                  <div>
                    <p className="audioplayer__name">{element[0]}</p>
                    <p className="audioplayer__artist">{element[1]}</p>
                  </div>
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
