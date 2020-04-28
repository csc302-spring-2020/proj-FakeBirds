import React, { Component } from "react";
import { Card } from "react-bootstrap";
import SDCQuestion from "./SDCQuestion";

export default class SDCSection extends Component {
  constructor(props) {
    super(props);
    // props that are expected: a section schema JSON containing section_title, section_questions
    // as well as an onChange function to save answers

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Send answers "further up" to the draft page, where we can save them
  handleChange(value, questionID, moreInfo = null) {
    this.props.onChange(value, questionID, moreInfo);
  }

  render() {
    const cardStyle = {
      borderRadius: "8px",
      padding: "6px",
      marginTop: "50px",
      width: "100%",
      backgroundColor: "#3B4856",
      boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.4)",
    };

    let questionComponents = [];

    this.props.section.questions.forEach((question) => {
      questionComponents.push(
        <SDCQuestion question={question} onChange={this.handleChange} />
      );
    });

    let subsectionComponents = [];

    this.props.section.subSections.forEach((section) => {
      subsectionComponents.push(
        <SDCSection section={section} onChange={this.handleChange} />
      );
    });

    return (
      <div>
        <Card style={cardStyle}>
          <h4
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#e59c63",
              marginLeft: "19px",
              marginTop: "12px",
            }}
          >
            {this.props.section.sectionTitle}
          </h4>
          {questionComponents}
          {subsectionComponents}
          {this.props.children}
        </Card>
      </div>
    );
  }
}
