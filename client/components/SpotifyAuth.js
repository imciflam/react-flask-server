import React, { Component } from "react";
import axios from "axios";

export class SpotifyAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: true
    };
    this.authTokenGetter = this.authTokenGetter.bind(this);
  }

  switchScreen(screen, data = "") {
    this.props.parentCallback(screen, data);
  }

  authTokenGetter() {
    this.setState({ showButton: false });
    axios
      .get("/token")
      .then(response => {
        const strWindowFeatures =
          "location=yes,height=570,width=520,scrollbars=yes,status=yes";
        const URL = response.data;
        const win = window.open(URL, "_blank", strWindowFeatures);
        let interval = setInterval(() => {
          // polling. yes...
          if (win.closed) {
            console.log("window is closed");
            clearInterval(interval);
            this.topListGetter();
            this.switchScreen("Loader");
          }
        }, 1000);
      })
      .catch(() => {
        alert("Something went wrong. Please try again.");
        this.switchScreen("LandingPage");
      });
  }

  topListGetter() {
    axios
      .all([axios.get("/knnlist"), axios.get("/cnnlist")])
      .then(
        axios.spread((knn, cnn) => {
          let arr1 = knn.data;
          let data1 = arr1.map(element => [...element, "knn"]);
          let arr2 = cnn.data;
          let data2 = arr2.map(element => [...element, "cnn"]);
          let newArr = [];
          for (let i = 0; i < data1.length; i++) {
            newArr.push(data1[i], data2[i]);
          }
          this.switchScreen("AudioPlayer", newArr);
        })
      )
      .catch(err => {
        console.log("FAIL", err);
      });
  }

  render() {
    return (
      <div className="landing__item landing__item--auth">
        <h1 className="visually-hidden">SpotifyAuth</h1>
        <div className="landing__wrapper">
          <p className="landing__text landing__text--auth">
            You can either authorize with your Spotify account...
          </p>
          {this.state.showButton ? (
            <input
              type="image"
              src="/static/img/Spotify_Icon_RGB_White.png"
              className="landing__img"
              alt="spotify auth"
              onClick={this.authTokenGetter}
            />
          ) : (
            <div>Wait for it...</div>
          )}
        </div>
      </div>
    );
  }
}

export default SpotifyAuth;
