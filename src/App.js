import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import Checkbox from "./Checkbox";
import Firestore from "./Firebase";

const categories = ["Shows", "Sports", "Art", "Nightlife", "Free", "Family", "Professional"];

const preferences = ["Lit", "Active", "Relaxing", "Cultural"];

class App extends Component {
  state = {
    title: "",
    description: "",
    primaryCategory: "",
    selectedCategories: [],
    primaryPreference: "",
    selectedPreferences: []
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
    const {
      primaryCategory,
      selectedCategories,
      primaryPreference,
      selectedPreferences,
      title,
      description
    } = this.state;

    const data = {
      primaryCategory,
      selectedCategories: [...selectedCategories, primaryCategory],
      primaryPreference,
      selectedPreferences: [...selectedPreferences, primaryPreference],
      title,
      description
    };

    Firestore.collection("labeledDescriptions")
      .add(data)
      .then(docRef => {
        this.setState(
          {
            primaryCategory: "",
            selectedCategories: [],
            primaryPreference: "",
            selectedPreferences: []
          },
          () => this.fetchDescription()
        );
      });
  };

  handlePrimaryChange = (key, label) => {
    this.setState({ [key]: label });
  };

  handleCheckboxChange = (key, label) => {
    const { [key]: selected } = this.state;

    if (selected.includes(label)) {
      const index = selected.indexOf(label);
      this.setState({
        [key]: [...selected.slice(0, index), ...selected.slice(index + 1)]
      });
    } else {
      this.setState({ [key]: [...selected, label] });
    }
  };

  render() {
    const {
      description,
      title,
      eventbrite_category,
      primaryCategory,
      selectedCategories,
      primaryPreference,
      selectedPreferences
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>title:</h1>
          <p>{title}</p>
          <h1>description:</h1>
          <p>{description}</p>
          <h1>eventbrite_category:</h1>
          <p>{eventbrite_category}</p>
          <h2>primary tag:</h2>
          <div className="tags">
            {categories.map((tag, i) => (
              <Checkbox
                key={i}
                handleCheckboxChange={tag => this.handlePrimaryChange("primaryCategory", tag)}
                label={tag}
                selected={primaryCategory === tag}
              />
            ))}
          </div>
          <h2>secondary tags:</h2>
          <div className="tags">
            {categories.map((tag, i) => (
              <Checkbox
                key={i}
                handleCheckboxChange={tag => this.handleCheckboxChange("selectedCategories", tag)}
                label={tag}
                selected={selectedCategories.includes(tag) || primaryCategory === tag}
              />
            ))}
          </div>
          <h2>primary preference:</h2>
          <div className="tags">
            {preferences.map((tag, i) => (
              <Checkbox
                key={i}
                handleCheckboxChange={tag => this.handlePrimaryChange("primaryPreference", tag)}
                label={tag}
                selected={primaryPreference === tag}
              />
            ))}
          </div>
          <h2>secondary preferences:</h2>
          <div className="tags">
            {preferences.map((tag, i) => (
              <Checkbox
                key={i}
                handleCheckboxChange={tag => this.handleCheckboxChange("selectedPreferences", tag)}
                label={tag}
                selected={selectedPreferences.includes(tag) || primaryPreference === tag}
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
