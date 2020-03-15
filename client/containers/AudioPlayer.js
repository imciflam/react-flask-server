import React, { Component } from "react";

export class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTrack: 0
    };  
  }

  switchTrack(key){
    this.setState({currentTrack: key})
  }

  render() {
    console.log(this.props);
    return (
      <div className="audioplayer">
        <h1 className="visually-hidden">AudioPlayer</h1>
        <div className="audioplayer__title">
          <p className="audioplayer__title--name">{this.props.tracks[this.state.currentTrack][1]} </p>
          <p className="audioplayer__title--artist">{this.props.tracks[this.state.currentTrack][0]} </p>
        </div>
        <div className="audioplayer-container"> 
        <div className="audioplayer__cover">
            <img className="audioplayer__image" src={this.props.tracks[this.state.currentTrack][3]} 
            alt="audioplayer image" />
        </div>
        <ul className="audioplayer__list"> 
          {this.props.tracks.map(element => {
            return (
              <li
                key={this.props.tracks.indexOf(element)}
                className="audioplayer__item"
                onClick = {()=>{this.switchTrack(this.props.tracks.indexOf(element))}}
              >
                <div>
                <p className="audioplayer__name">{element[0]}</p>
                <p className="audioplayer__artist">{element[1]}</p></div> 
              </li>
            ); 
          })}
        </ul>
        </div>
        <div className="audioplayer__audio-container">
                  <audio className="audioplayer__audio-kit" controls>
                    <source src={this.props.tracks[this.state.currentTrack][2]}  />
                  </audio>
                </div> 
      </div>
    );
  }
}

export default AudioPlayer;
