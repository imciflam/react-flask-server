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
        console.log(URL);
        window.open(URL, "_blank", strWindowFeatures);
      })
      .then(() => {
        this.switchScreen("Loader");
        setTimeout(() => this.topListGetter(), 100); // timeOut for server to fetch token. 500ms is optimal value.
      })
      .catch(() => {
        alert("Something went wrong. Please try another artist.");
        this.switchScreen("LandingPage");
      });
  }

  topListGetter() {
    axios.all([axios.get("/knnlist"), axios.get("/cnnlist")]).then(
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
    );
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
            <div>Подождите...</div>
          )}
        </div>
      </div>
    );
  }
}

export default SpotifyAuth;
