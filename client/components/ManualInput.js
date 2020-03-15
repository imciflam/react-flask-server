import React, { Component } from "react";
import axios from "axios";

export class ManualInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  switchScreen(screen, data = "") {
    this.props.parentCallback(screen, data);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.switchScreen("Loader");
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
          this.switchScreen("AudioPlayer", newArr);
          // deezer api as a fallback?
        })
      )
      .catch(() => {
        alert("Something went wrong. Please try another artist.");
        this.switchScreen("LandingPage");
      });
  }

  render() {
    return (
      <div className="landing__item landing__item--manual">
        <h1 className="visually-hidden">ManualInput</h1>
        <div className="landing__wrapper">
          <form className="landing__form" onSubmit={this.handleSubmit}>
            <p className="landing__text landing__text--manual">
              ...or just tell us your favorite artist's name.
            </p>
            <label>
              <input
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
                className="landing__input"
                placeholder="The Prodigy..."
              />
            </label>
            <br />
            <button className="landing__button" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default ManualInput;
