import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import Checkbox from "./Checkbox";
import Firestore from "./Firebase";

const categories = [
  "Concerts",
  "Sports",
  "Shows",
  "Comedy",
  "Art",
  "Nightlife",
  "Free",
  "Family",
  "Professional"
];

const preferences = ["Lit", "Active", "Relaxing", "Outdoor", "Art"];

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
    Firestore.collection("unlabeled")
      .limit(1)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const documentSnapshot = snapshot.docs[0];

          const { description, title, eventbrite_category } = documentSnapshot.data();
          this.setState({ description, title, eventbrite_category });

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

    Firestore.collection("labeledDescriptions")
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
    const { description, title, eventbrite_category, selectedTags } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>title:</h1>
          <p>{title}</p>
          <h1>description:</h1>
          <p>{description}</p>
          <h1>eventbrite_category:</h1>
          <p>{eventbrite_category}</p>
          <h2>tags:</h2>
          <div className="tags">
            {categories.map((tag, i) => (
              <Checkbox
                key={i}
                handleCheckboxChange={this.handleCheckboxChange}
                label={tag}
                selected={selectedTags.includes(tag)}
              />
            ))}
          </div>
          <h2>preferences:</h2>
          <div className="tags">
            {preferences.map((tag, i) => (
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
