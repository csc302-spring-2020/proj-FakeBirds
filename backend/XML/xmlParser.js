const xml2js = require("xml2js"),
  log = console.log;

function xmlParse(data) {
  var parser = new xml2js.Parser();
  // require("fs").readFile(__dirname + "/source/lung_surgery.xml", function(
  //   err,
  //   data
  // ) {
  //   parser.parseString(data, function(err, result) {
  //     let FormDesign = result.SDCPackage
  //       ? result.SDCPackage.XMLPackage[0].FormDesign
  //       : result.FormDesign;

  //     FormDesign = FormDesign.constructor === Array ? FormDesign[0] : FormDesign;

  //     const re = buildFormSchemas(FormDesign);

  //     log(JSON.stringify(re));
  //   });
  // });

  return new Promise((res, rej) => {
    parser.parseString(data, function (err, result) {
      let FormDesign = result.SDCPackage
        ? result.SDCPackage.XMLPackage[0].FormDesign
        : result.FormDesign;

      FormDesign =
        FormDesign.constructor === Array ? FormDesign[0] : FormDesign;
      const re = buildFormSchemas(FormDesign);

      res(re);
    });
  });
}

/*
This function extracts questions from the raw json from xml2js.
json: string
returns list of json of questions
example [Question1, question2, [question4, [question5, question6]], question3]

*/
// pass in individual sections
function extractQuestions(sectionInput) {
  let reQuestions = [];
  const section =
    sectionInput.constructor === Array ? sectionInput[0] : sectionInput;
  let ListQuestions = section.ChildItems[0].Question;
  // let ListSections = section.ChildItems[0].Section;
  if (ListQuestions != null) {
    let qs = ListQuestions.map((q) => parsingQuestion(q));

    reQuestions.push(...qs);
  }
  // else if (ListSections) {
  //   reQuestions.push(extractQuestions(ListSections));
  // }
  return reQuestions;
}

function parsingQuestion(questionInput) {
  /*
{
  questionID: "77894.100004300"
  questionTitle: "Clinical History:",
  dependentQuestions: ["xxx", "yyy"],
  questionBody: null,
  answerType: 0,
  answerObject: {questionID: "77894.100004300", answer: null}
}
*/
  let questionID,
    questionTitle,
    questionText,
    questionBody,
    answerType,
    answerObject;
  const question =
    questionInput.constructor === Array ? questionInput[0] : questionInput;
  questionID = question.$.ID;
  questionTitle = question.$.title;
  questionText = null;
  questionText = question.Property ? question.Property[0].$.val : null;

  if (question.ListField && question.ListField[0].List[0].ListItem) {
    // this is a multiple choice question
    // log(JSON.stringify(question));
    let options = question.ListField[0].List[0].ListItem.map((item) => ({
      optionID: item.$.ID,
      value: item.$.title,
      moreInfo: item.ListItemResponseField ? true : false,
      ResponseField: null,
    }));
    if (question.ListField[0]) {
      questionBody = { is_radio: true, is_checkbox: false, options: options };
      answerType = 2;

      if (question.ListField[0].$ && question.ListField[0].$.maxSelections) {
        questionBody = { is_radio: false, is_checkbox: true, options: options };
        answerType = 3;
      }
    }
  } else if (question.ResponseField) {
    questionBody = null;
    answerType = 0;
  }
  // If ResponseField then text only, If ListField then multiple choice
  answerObject = { questionID, answer: null };
  return {
    questionID,
    questionTitle,
    questionText,
    dependentQuestions: question.ChildItems
      ? question.ChildItems[0].Question.map((q) => parsingQuestion(q))
      : [],
    questionBody,
    answerType,
    answerObject,
  };
}

/*
{
  sectionID: {
    type: String,
    required: true,
    unique: true
  },
  sectionTitle: {
    type: String,
    required: true
  },
  subSections: [this],
  questions: [QuestionSchema]
}
*/
// FormDesign.Body.ChildItems.Sections
function buildSectionSchemas(sectionArray) {
  let sectionID, sectionTitle, subSections, questions;
  let reSections = [];
  for (let i = 0; i < sectionArray.length; i++) {
    sectionID = sectionArray[i].$.ID;
    sectionTitle = sectionArray[i].$.title;
    subSections = sectionArray[i].ChildItems[0].Section
      ? buildSectionSchemas(sectionArray[i].ChildItems[0].Section)
      : [];
    questions = extractQuestions(sectionArray[i]);
    reSections.push({ sectionID, sectionTitle, subSections, questions });
  }
  return reSections;
}

/*
{
    formID: {
      type: Number,
      required: true,
      unique: true
    },
    diagnosticID: {
      type: Number,
      required: true,
      unique: true
    },
    version: String,
    originalFile: {
      type: String,
      required: true
    },
    property: [new Schema({ name: String, type: String, val: String })],
    note: String,
    sections: [SectionSchema],
    comment: QuestionSchema,
    copyrightFooter: String
  }
*/

function buildFormSchemas(formDesign) {
  let formID,
    formTitle,
    diagnosticID,
    version,
    originalFile,
    property,
    note,
    sections,
    comment,
    copyrightFooter;

  formID = require("crypto")
    .createHash("sha256")
    .update(formDesign.$.ID.concat(formDesign.$.version))
    .digest("hex")
    .slice(0, 30);
  formTitle = formDesign.$.formTitle;
  diagnosticID = null;
  version = formDesign.$.version;
  originalFile = formDesign.$.filename;
  property = formDesign.Property.map((prop) => extractProperty(prop));
  note = formDesign.Body[0].ChildItems[0].DisplayedItem
    ? formDesign.Body[0].ChildItems[0].DisplayedItem[0].$.title
    : null;
  sections = buildSectionSchemas(formDesign.Body[0].ChildItems[0].Section);
  comment = formDesign.Body[0].ChildItems[0].Question
    ? parsingQuestion(formDesign.Body[0].ChildItems[0].Question[0])
    : null;
  copyrightFooter = formDesign.Footer[0].Property[0].$.val;

  return {
    formID,
    formTitle,
    diagnosticID,
    version,
    originalFile,
    property,
    note,
    sections,
    comment,
    copyrightFooter,
  };
}

function extractProperty(property) {
  return { name: property.$.propName, value: property.$.val };
}

module.exports = {
  xmlParse,
};
