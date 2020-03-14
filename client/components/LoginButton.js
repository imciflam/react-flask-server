import React from "react";
import axios from "axios";

class LoginButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: true,
      value: ""
    };
    this.authTokenGetter = this.authTokenGetter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        setTimeout(() => this.topListGetter(), 250); // timeOut for server to fetch token. 250ms is optimal value.
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

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios
      .all([
        axios.post("/knnitem", JSON.stringify(this.state.value), {
          headers: { "Content-Type": "application/json" }
        }),
        axios.post("/cnnitem", JSON.stringify(this.state.value), {
          headers: { "Content-Type": "application/json" }
        })
      ])
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
          console.log(newArr);
          // deezer api as a fallback?
        })
      );
  }

  render() {
    return (
      <div>
        {this.state.showButton ? (
          <button onClick={this.authTokenGetter}>login</button>
        ) : null}

        <form onSubmit={this.handleSubmit}>
          <label>
            Favourite band:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Отправить" />
        </form>
      </div>
    );
  }
}

export default LoginButton;
