import React from "react";
import axios from "axios";

class LoginButton extends React.Component {
  constructor() {
    super();
    this.state = {
      showButton: true
    };
    this.authTokenGetter = this.authTokenGetter.bind(this);
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

  topInformationGetter(e) {
    e.preventDefault();
    axios
      .get("/list")
      .then(response => {
        let arr = response.data;
        let data = arr.map(element => [...element, "cnn"]);
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
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
