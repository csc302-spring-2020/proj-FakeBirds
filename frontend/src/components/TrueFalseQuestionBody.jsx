import React, { Component } from "react";

export default class TrueFalseQuestionBody extends Component {
  constructor(props){
    super(props);
    // props that are expected: onChange, question_id, answer

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      answer: props.answer
    };
  }

  handleChange(event) {
    const text = event.target.value;
    let bool = false;
    if (text === "true") {
      bool = true;
    }

    this.setState({
      answer: bool
    });

    this.props.onChange(bool);
  }

  render() {
    return (
      <div>
        <input type="radio" id={this.props.question_id + "true"} name={this.props.question_id} value="true" onChange={this.handleChange} checked={this.state.answer === true} />
        <label style={{paddingLeft: "3px"}} for={this.props.question_id + "true"}>True</label>
        &emsp;
        <input type="radio" id={this.props.question_id + "false"} name={this.props.question_id} value="false" onChange={this.handleChange} checked={this.state.answer === false} />
        <label style={{paddingLeft: "3px"}} for={this.props.question_id + "false"}>False</label>
        {this.props.children}
      </div>
    );
  }
}
