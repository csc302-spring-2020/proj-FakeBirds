const router = require("express").Router();

const formController = require("../controllers/form.controller");

/*
 * Post new XML to be processed
 */
router.route("/import").post(formController.create);

/*
 * Remove a fillable
 */
router.route("/remove/:formID").delete(formController.destroy);

/*
 * Search for a form
 */
router.route("/search/:title").get(formController.searchForm);

/*
 * Get all available fillout forms
 */
router.route("/").get(formController.list);

/*
 * Get draft form specifically @formID @patientID
 */
router.route("/get/:formID/:patientID").get(formController.createDraft);

/*
 * Get fillable form specifically @formID - DEPRECATED
 */
router.route("/get/:formID").get(formController.getFillable);

/*
 * Get draft @diagnosticID
 */
router.route("/draft/get/:diagnosticID").get(formController.getDraft);

/*
 * Post new changes to draft/Create Draft
 */
router.route("/draft/save").post(formController.saveDraft);

module.exports = router;
