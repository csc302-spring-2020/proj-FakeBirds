const admin = require("../models/admin.model");
const form = require("../models/form.model");
const draft = require("../models/draft.model");
const patient = require("../models/patient.model");

const parser = require("../XML/xmlParser.js");
const fs = require("fs");
const log = console.log;
const CryptoJS = require("crypto-js");

/**
 * Form Controller
 *
 * @description :: Server-side logic for managing Forms.
 */

function cryptEn(data) {
  return new Promise((res, rej) => {
    const encrypted = CryptoJS.AES.encrypt(data, "secret")
      .toString()
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    res(encrypted);
  });
}

function cryptDe(encrypted) {
  return new Promise((res, rej) => {
    const reAligning = encrypted.replace(/-/g, "+").replace(/_/g, "/");
    res(CryptoJS.AES.decrypt(reAligning, "secret").toString(CryptoJS.enc.Utf8));
  });
}

function create(req, res) {
  // Take in XML

  fs.readFile(req.file.path, { encoding: "utf-8" }, function (e, file) {
    if (!e) {
      parser
        .xmlParse(file)
        .then((data) => {
          // res.status(200).json(data);
          // upload to Atlas
          form.collection
            .insertOne(data)
            .then((x) => {
              admin.findOneAndUpdate({}, { new: true }, (err, re) => {
                re.allForms.push({
                  formID: data.formID,
                  formTitle: data.formTitle,
                });
                re.save()
                  .then((x) =>
                    res
                      .status(200)
                      .send(`inserted ${data.formID} - ${data.formTitle}`)
                  )
                  .catch((e) => res.status(500).send(e.message));
              });
            })
            .catch((e) => res.status(409).send(e.message));
        })
        .catch((e) => res.status(500).send(e.message));
    } else {
      res.status(500).send(e);
    }
  });
}

// (destroy) one single object DELETE /:id
function destroy(req, res) {
  form.deleteOne({ formID: req.params.formID }).then((re) => {
    res
      .status(200)
      .send(`removed form - ${req.params.formID}`)
      .catch((e) => res.status(500).send(e.message));
  });
}
function searchForm(req, res) {
  admin
    .findOne()
    .then((data) => {
      const withTitle = data["allForms"].filter((form) =>
        form.formTitle.includes(req.params.title)
      );

      res.json({
        allForms: withTitle,
      });
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
}

// (read) all objects -- GET /
function list(req, res) {
  admin
    .findOne()
    .then((data) => {
      res.json({
        allForms: data["allForms"],
      });
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
}

function createDraft(req, res) {
  form.findOne({ formID: req.params.formID }).then((data) => {
    cryptEn(
      req.params.formID.concat(" ", data.version, " ", req.params.patientID)
    )
      .then((diag) => {
        const newDraft = data.toObject();
        newDraft.diagnosticID = diag; // Generating diagnosticID for new Draft
        res.json(newDraft);
      })
      .catch((error) => {
        res.status(404).send(error.message);
      });
  });
}

function getFillable(req, res) {
  form
    .findOne({ formID: req.params.formID })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
}

function getDraft(req, res) {
  draft
    .findOne({ diagnosticID: req.params.diagnosticID })
    .then((draft) => {
      res.status(200).json(draft);
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
}

function saveDraft(req, res) {
  draft
    .findOne({ diagnosticID: req.body.payload.diagnosticID })
    .then((exists) => {
      if (exists) {
        // delete form
        draft
          .deleteOne({ diagnosticID: req.body.payload.diagnosticID })
          .catch((e) => res.status(500).send(e.message));
        // update form
        draft.collection
          .insertOne(req.body.payload)
          .then((data) => {
            if (data.insertedCount !== 1) {
              res.status(404).send("Unable to insert document to database");
            }
            res.status(200).send("updated new data to draft");
          })
          .catch((error) => {
            res.status(500).send(error.message);
          });
      } else {
        draft.collection
          .insertOne(req.body.payload)
          .then((data) => {
            if (data.insertedCount !== 1) {
              res.status(404).send("Unable to insert document to database");
            }

            cryptDe(req.body.payload.diagnosticID)
              .then((decrypted) => {
                // Append to patient profile
                const patientID = decrypted.slice(-15);
                patient.findOneAndUpdate(
                  { patientID: patientID },
                  { new: true },
                  (err, re) => {
                    if (err) {
                      res.status(500).send(err);
                    } else {
                      re.relatedForms.push({
                        filler: "Admin",
                        diagnosticID: req.body.payload.diagnosticID,
                      });
                      re.save()
                        .then((x) => {
                          res
                            .status(200)
                            .send("added draft to patient profile");
                        })
                        .catch((error) => {
                          res.status(500).send(error.message);
                        });
                    }
                  }
                );
              })
              .catch((error) => {
                res.status(500).send(error.message);
              });
          })
          .catch((error) => {
            res.status(500).send(error.message);
          });
      }
    })
    .catch((e) => res.status(500).send(e.message));
}

module.exports = {
  searchForm,
  create,
  list,
  createDraft,
  getDraft,
  getFillable,
  destroy,
  saveDraft,
};
