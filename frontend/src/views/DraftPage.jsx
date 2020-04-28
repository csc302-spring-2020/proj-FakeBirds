import React, { Component } from "react";
import SDCSection from "../components/SDCSection";
import axios from "axios";
import styled from "styled-components/macro";

const MainTitle = styled.div`
  h1 {
    font-style: normal;
    font-weight: bold;
    font-size: 52px;
    line-height: 55px;
    color: #ffffff;
  }
  h7 {
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    color: #e7eff6;
    margin-top: 5px;
  }
`;

export default class DraftPage extends Component {
  constructor(props) {
    super(props);

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.findQuestionAndUpdate = this.findQuestionAndUpdate.bind(this);
    this.findSectionAndUpdate = this.findSectionAndUpdate.bind(this);
    this.saveDraft = this.saveDraft.bind(this);

    this.initialize = this.initialize.bind(this);

    // draft is not in this.state because we don't need the draft component to re-render
    // every time we update the answers - sub components take care of the re-rendering
    this.draft = null;

    this.state = {
      fetchError: null,
    };
  }

  //TODO: PLEASE REFACTOR THIS OMG

  cryptEn(data) {
    // formID.concat(data.version, patientID)
    return new Promise((res, rej) => {
      const encrypted = require("crypto-js")
        .AES.encrypt(data, "secret")
        .toString()
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
      res(encrypted);
    });
  }

  cryptDe(encrypted) {
    return new Promise((res, rej) => {
      const reAligning = encrypted.replace(/-/g, "+").replace(/_/g, "/");
      const decrypted = require("crypto-js")
        .AES.decrypt(reAligning, "secret")
        .toString(require("crypto-js").enc.Utf8)
        .split(" ");

      const formID = decrypted[0];
      const patientID = decrypted[2];

      res({ formID: formID, patientID: patientID });
    });
  }

  handleChange(value, questionID, moreInfo = null) {
    if (this.draft === null) {
      return;
    }

    this.draft.sections.forEach((section) => {
      this.findSectionAndUpdate(section, questionID, value, moreInfo);
    });
  }

  findSectionAndUpdate(section, questionID, value, moreInfo) {
    section.questions.forEach((question) => {
      this.findQuestionAndUpdate(question, questionID, value, moreInfo);
    });

    section.subSections.forEach((subSection) => {
      this.findSectionAndUpdate(subSection, questionID, value, moreInfo);
    });
  }

  findQuestionAndUpdate(question, questionID, value, moreInfo) {
    if (question.questionID === questionID) {
      question.answerObject.answer = value;

      if (moreInfo && question.questionBody) {
        question.questionBody.options.forEach((option) => {
          if ((option.optionID in moreInfo) && option.moreInfo) {
            option.ResponseField = moreInfo[option.optionID];
          }
        });
      }
    }

    question.dependentQuestions.forEach((dependentQuestion) => {
      this.findQuestionAndUpdate(dependentQuestion, questionID, value, moreInfo);
    });
  }

  saveDraft() {
    // API call to save the json into database
    if (this.draft === null) {
      return null;
    }

    axios({
      method: "post",
      url: "http://localhost:3001/api/v1/form/draft/save",
      data: { payload: this.draft },
      json: true,
    })
      .then(function (response) {
        alert("Form saved successfully!");
      })
      .catch(function (response) {
        alert("Sorry, failed to save form, an error occurred.\n" + response);
      });

    return;
  }

  initialize() {
    axios({
      method: "get",
      url: `http://localhost:3001/api/v1/form/draft/get/${this.props.match.params.diagnosticID}`,
      responseType: "application/json",
    })
      .then((response) => {
        if (!response.data) {
          this.cryptDe(this.props.match.params.diagnosticID)
            .then((decrypted) => {
              axios({
                method: "get",
                url: `http://localhost:3001/api/v1/form/get/${decrypted.formID}/${decrypted.patientID}`,
                responseType: "application/json",
              }).then((response) => {
                response.data.diagnosticID = this.props.match.params.diagnosticID;
                this.draft = response.data;
                this.forceUpdate(); // Force render so that the form is displayed.
              });
            })
            .catch((error) => {
              this.setState({
                fetchError: true,
                error: error,
              });
            });
        } else {
          this.draft = response.data;
          this.forceUpdate(); // Force render so that the form is displayed
        }
      })
      .catch((error) => {
        this.setState({
          fetchError: true,
          error: error,
        });
      });
  }

  componentDidMount() {
    this.initialize();
  }

  render() {
    if (this.state.fetchError) {
      return (
        <div className="draft-page">
          <div className="App-header">
            <h5>Sorry, an error has occured. Please try reloading the page.</h5>
            <br />
            {this.state.fetchError}
          </div>
        </div>
      );
    }

    if (this.draft === null) {
      return null;
    }

    let sections = [];

    this.draft.sections.forEach((section) => {
      sections.push(
        <SDCSection section={section} onChange={this.handleChange} />
      );
    });

    const formStyle = {
      width: "1200px",
      margin: "100px auto 200px auto",
    };

    const saveButtonStyle = {
      position: "fixed",
      bottom: "38px",
      right: "5%",
      width: "125px",
      height: "50px",
      borderColor: "#E59C63",
      borderRadius: "8px",
      backgroundColor: "#E59C63",
      outline: "none",
      fontWeight: "bold",
      fontSize: "20px",
      color: "white",
      textTransform: "uppercase",
    };

    return (
      <div className="draft-page">
        <div className="App-header">
          <div style={formStyle}>
            <MainTitle>
              <h1>{this.draft.formTitle}</h1>
              <h7>Version {this.draft.version}</h7>
            </MainTitle>
            {sections}
          </div>
          <button style={saveButtonStyle} onClick={this.saveDraft}>
            Save
          </button>
        </div>
      </div>
    );
  }
}
