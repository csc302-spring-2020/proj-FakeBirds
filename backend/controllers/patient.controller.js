let Patient = require("../models/patient.model");
let Form = require("../models/form.model");

/**
 * Patient Controller
 *
 * @description :: Server-side logic for managing users.
 */

function listPatient(req, res) {
  Patient.find()
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
}

function searchPatient(req, res) {
  Patient.find({ name: req.params.name }, function (err, allPatients) {
    res.json(allPatients);
  });
}

function getPatient(req, res) {
  Patient.findOne({ patientID: req.params.id })
    .then((patient) => res.json(patient))
    .catch((err) => res.status(400).json("Error: " + err));
}

function createPatient(req, res) {
  const { patientID, name, email, phone } = req.body;
  const newPatient = new Patient({ patientID, name, email, phone });
  newPatient
    .save()
    .then(() => res.json("Patient added"))
    .catch((err) => res.status(400).json("Error: " + err));
}

function updatePatient(req, res) {
  Patient.findById(req.params.id)
    .then((patient) => {
      const { patientID, name, email, phone } = req.body;
      patient.patientID = patientID;
      patient.name = name;
      patient.email = email;
      patient.phone = phone;

      patient
        .save()
        .then(() => res.json("Patient updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
}

function deletePatient(req, res) {
  Patient.findByIdAndDelete(req.params.id)
    .then(() => res.json("Patient deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
}
module.exports = {
  listPatient,
  searchPatient,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
};
