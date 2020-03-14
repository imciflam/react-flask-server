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
      <div className="landing__item landing__item--manual">
        <h1 className="visually-hidden">ManualInput</h1>
        <form className="landing__form" onSubmit={this.handleSubmit}>
          <label htmlFor="landing__input">
            <p className="landing__text landing__text--manual">
              ...or just tell us your favorite artist's name.
            </p>
          </label>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            className="landing__input"
          />
          <input type="submit" value="Отправить" />
        </form>
      </div>
    );
  }
}

export default ManualInput;
