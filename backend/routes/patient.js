const router = require("express").Router();
const patientController = require("../controllers/patient.controller");

/*
 * Get all patients
 */
router.route("/").get(patientController.listPatient);

/*
 * Search for patient @name
 */
router.route("/search/:name").get(patientController.searchPatient);

/*
 * Get patient @id
 */
router.route("/:id").get(patientController.getPatient);

/*
 * Create
 */
router.route("/add").post(patientController.createPatient);

/*
 * Update @id
 */
router.route("/update/:id").post(patientController.updatePatient);

/*
 * Delete @id
 */
router.route("/:id").delete(patientController.deletePatient);

module.exports = router;
