import React from "react";
import axios from "axios";

class LoginButton extends React.Component {
  constructor() {
    super();
    this.state = {
      showButton: true
    };
    this.authTokenGetter = this.authTokenGetter.bind(this);
    this.interleave = this.interleave.bind(this);
  }
  authTokenGetter(e) {
    e.preventDefault();

    this.setState({ showButton: false });
    axios
      .get("/token")
      .then(function(response) {
        const strWindowFeatures =
          "location=yes,height=570,width=520,scrollbars=yes,status=yes";
        const URL = response.data;
        window.open(URL, "_blank", strWindowFeatures);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  interleave(arr, arr2) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      newArr.push(arr[i], arr2[i]);
    }
    return newArr;
  }

  topInformationGetter(e) {
    e.preventDefault();
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
      <div>
        {this.state.showButton ? (
          <button onClick={this.authTokenGetter}>login</button>
        ) : null}

        <button onClick={this.topInformationGetter}>get tracks</button>
      </div>
    );
  }
}

export default LoginButton;
