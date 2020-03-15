import React, { Component } from "react";

export class AudioPlayer extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        AudioPlayer
        <ul>
          {this.props.tracks.map(element => {
            return (
              <li key={this.props.tracks.indexOf(element)}>
                <p>{element[0]}</p>
                <p>{element[1]}</p>
                <p>
                  <audio controls>
                    <source src={element[2]} />
                    <source src="audio/music.mp3" type="audio/mpeg" />
                    Тег audio не поддерживается вашим браузером.
                    <a href="audio/music.mp3">Скачайте музыку</a>.
                  </audio>
                </p>
                <p>
                  <img src={element[3]} width="450" height="450" alt="" />
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default AudioPlayer;
