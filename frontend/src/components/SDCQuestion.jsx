import React, { Component } from "react";
import { Card } from "react-bootstrap";

import TrueFalseQuestionBody from "./TrueFalseQuestionBody";
import MultipleChoiceRadioQuestionBody from "./MultipleChoiceRadioQuestionBody";
import MultipleChoiceCheckboxQuestionBody from "./MultipleChoiceCheckboxQuestionBody";
import TextQuestionBody from "./TextQuestionBody";
import IntQuestionBody from "./IntQuestionBody";

export default class SDCQuestion extends Component {
  constructor(props) {
    super(props);
    // props are expected to be: a question schema JSON which contains question id,
    // question title, question type, question text, question, options if applicable,
    // answer (if an answer has already been selected and saved), and dependent questions
    // Also, an onChange function to store this question's answer

    this.render = this.render.bind(this);
    this.handleSelfChange = this.handleSelfChange.bind(this);
    this.handleDependentQuestionChange = this.handleDependentQuestionChange.bind(
      this
    );

    this.state = {
      is_true_false: false,
      is_multiple_choice_radio: false,
      is_multiple_choice_checkbox: false,
      is_int: false,
      is_text: false,
    };

    if (props.question.answerType === null) {
      this.state["is_text"] = true;
    } else if (props.question.answerType === 4) {
      this.state["is_true_false"] = true;
    } else if (props.question.answerType === 3) {
      this.state["is_multiple_choice_checkbox"] = true;
    } else if (props.question.answerType === 2) {
      this.state["is_multiple_choice_radio"] = true;
    } else if (props.question.answerType === 1) {
      this.state["is_int"] = true;
    } else {
      this.state["is_text"] = true;
    }
  }

  // Handle answers for this question
  handleSelfChange(value, moreInfo = null) {
    this.props.onChange(value, this.props.question.questionID, moreInfo);
  }

  // Handle answers for dependent questions
  handleDependentQuestionChange(value, questionID, moreInfo = null) {
    this.props.onChange(value, questionID, moreInfo);
  }

  render() {
    const cardStyle = {
      border: "0",
      // margin: "5px",
      backgroundColor: "#3B4856",
    };

    let dependentQuestionComponents = [];

    if (this.state.answer) {
      this.props.question.dependentQuestions.forEach((dependentQuestion) => {
        dependentQuestionComponents.push(
          <SDCQuestion
            question={dependentQuestion}
            onChange={this.handleDependentQuestionChange}
          />
        );
      });
    }

    return (
      <div>
        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title style={{ fontSize: "24px", fontWeight: "bold" }}>
              {this.props.question.questionTitle}
            </Card.Title>
            <Card.Text>
              <div style={{ marginBottom: "5px" }}>
                {this.props.question.questionText}
              </div>
              {this.state.is_true_false && (
                <TrueFalseQuestionBody
                  question_id={this.props.question.questionID}
                  onChange={this.handleSelfChange}
                  answer={this.props.question.answerObject.answer}
                />
              )}
              {this.state.is_multiple_choice_radio && (
                <MultipleChoiceRadioQuestionBody
                  question_id={this.props.question.questionID}
                  question_options={this.props.question.questionBody.options}
                  onChange={this.handleSelfChange}
                  answer={this.props.question.answerObject.answer}
                />
              )}
              {this.state.is_multiple_choice_checkbox && (
                <MultipleChoiceCheckboxQuestionBody
                  question_id={this.props.question.questionID}
                  question_options={this.props.question.questionBody.options}
                  onChange={this.handleSelfChange}
                  answer={this.state.answer}
                  moreInfo={this.props.question.answerObject.answer}
                />
              )}
              {this.state.is_int && (
                <IntQuestionBody
                  onChange={this.handleSelfChange}
                  answer={this.props.question.answerObject.answer}
                />
              )}
              {this.state.is_text && (
                <TextQuestionBody
                  onChange={this.handleSelfChange}
                  answer={this.props.question.answerObject.answer}
                />
              )}
            </Card.Text>
          </Card.Body>
          {dependentQuestionComponents}
          {this.props.children}
        </Card>
      </div>
    );
  }
}
