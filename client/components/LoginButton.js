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
        window.location.href = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div>
        {this.state.showButton ? (
          <button onClick={this.authTokenGetter}>login</button>
        ) : null}
      </div>
    );
  }
}

export default LoginButton;
