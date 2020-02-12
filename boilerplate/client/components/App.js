import React from "react";
import Kek from "./Kek";
import axios from "axios";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showButton: true
    };
    this.authTokenGetter = this.authTokenGetter.bind(this);
  }
  authTokenGetter(e) {
    e.preventDefault();
    console.log("По ссылке кликнули.");

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
    console.log(this.state);
    return (
      <div className="App">
        <p>Apps</p>
        <Kek />
        {this.state.showButton ? (
          <button onClick={this.authTokenGetter}>login</button>
        ) : null}
      </div>
    );
  }
}

export default App;
