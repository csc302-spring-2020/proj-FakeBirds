const app = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);
describe("apiPatient testing", () => {
  it("retrieves all patients", (done) => {
    chai
      .request(app)
      .get("/api/v1/patient/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.include({
          _id: "5e933a11888dd00eeaad324f",
          patientID: "0516ae2ce344167",
          name: "test",
          email: "test@me.com",
          phone: 111111111,
          relatedForms: [],
          createdAt: "2020-04-12T15:56:01.797Z",
          updatedAt: "2020-04-15T05:14:57.364Z",
          __v: 1,
        });
        done();
      });
  });

  it("retrieves specific patient", (done) => {
    chai
      .request(app)
      .get("/api/v1/patient/0516ae2ce344167")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.name).to.equal("test");
        done();
      });
  });

  it("search for test patient", (done) => {
    chai
      .request(app)
      .get("/api/v1/patient/search/test")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.include({
          _id: "5e933a11888dd00eeaad324f",
          patientID: "0516ae2ce344167",
          name: "test",
          email: "test@me.com",
          phone: 111111111,
          relatedForms: [],
          createdAt: "2020-04-12T15:56:01.797Z",
          updatedAt: "2020-04-15T05:14:57.364Z",
          __v: 1,
        });
        done();
      });
  });
});
