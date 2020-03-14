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

  authTokenGetter() {
    this.setState({ showButton: false });
    axios
      .get("/token")
      .then(response => {
        const strWindowFeatures =
          "location=yes,height=570,width=520,scrollbars=yes,status=yes";
        const URL = response.data;
        window.open(URL, "_blank", strWindowFeatures);
      })
      .then(() => {
        setTimeout(() => this.topListGetter(), 300); // timeOut for server to fetch token. 300ms is optimal value.
      })
      .catch(error => {
        console.log(error);
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
        console.log(newArr);
      })
    );
  }

  render() {
    return (
      <div className="landing__item landing__item--auth">
        <h1 className="visually-hidden">SpotifyAuth</h1>
        {this.state.showButton ? (
          <button onClick={this.authTokenGetter}>login</button>
        ) : null}
      </div>
    );
  }
}

export default SpotifyAuth;
