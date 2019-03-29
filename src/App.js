import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import Checkbox from "./Checkbox";
import Firestore from "./Firebase";

const tags = ["Free", "Club", "Comedy", "Show"];

class App extends Component {
  state = {
    title: "",
    description: "",
    selectedTags: []
  };

  componentDidMount() {
    this.fetchDescription();
  }

  fetchDescription = () => {
    Firestore.collection("descriptions")
      .limit(1)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const documentSnapshot = snapshot.docs[0];

          const { description, title } = documentSnapshot.data();
          this.setState({ description, title });

          return documentSnapshot.ref.delete();
        } else {
          console.log("No document corresponding to the query!");
          return null;
        }
      });
  };

  submitTags = () => {
    const { selectedTags, title, description } = this.state;
    const data = {
      selectedTags,
      title,
      description
    };

    Firestore.collection("tagged_descriptions")
      .add(data)
      .then(docRef => {
        this.setState({ selectedTags: [] }, () => this.fetchDescription());
      });
  };

  handleCheckboxChange = label => {
    const { selectedTags } = this.state;

    if (selectedTags.includes(label)) {
      const index = selectedTags.indexOf(label);
      this.setState({
        selectedTags: [...selectedTags.slice(0, index), ...selectedTags.slice(index + 1)]
      });
    } else {
      this.setState({ selectedTags: [...selectedTags, label] });
    }
  };

  render() {
    const { description, title, selectedTags } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <p>title: {title}</p>
          <p>description: {description}</p>
          <div className="tags">
            {tags.map((tag, i) => (
              <Checkbox
                key={i}
                handleCheckboxChange={this.handleCheckboxChange}
                label={tag}
                selected={selectedTags.includes(tag)}
              />
            ))}
          </div>
          <div className="button" onClick={this.submitTags}>
            submit
          </div>
        </header>
      </div>
    );
  }
}

export default App;
