require("dotenv").config();
const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");

const repositories = sinon.stub();
const services = require("../../domain")(repositories);
const app = require("../../router/http/app")(services);
const jwt = require("jsonwebtoken");
const projectData = require("../data/project").projects;

const projectService = services.projectService;
const jwtSecret = process.env.JWT_SECRET;
const testEmail = "kent@gmail.com";
const testFullname = "klark kent";
const testID = "111111";

let testToken;

/*eslint-disable */
describe("project routes test", function() {
  describe("GET /project test", function() {
    var auth = {};
    //before(loginUser(auth));

    beforeEach(done => {
      sinon.stub(projectService, "list");
      testToken = jwt.sign(
        { email: testEmail, fullName: testFullname, _id: testID },
        jwtSecret,
        { expiresIn: 120 }
      );
      return done();
    });

    afterEach(() => {
      projectService.list.restore();
    });

    it("should return 200 an array of posts", function(done) {
      projectService.list.resolves(projectData);
      request(app)
        .get("/project")
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.eql(projectData.length);
          return done();
        });
    });

    it("should return 403 when no token send", function() {
      return request(app)
        .get("/project")
        .expect(401);
    });

    it("should return 401 when we send invalid token", function() {
      return request(app)
        .get("/project")
        .set("Authorization", `Bearer ${testToken}test`)
        .expect(401);
    });
  });

  describe("GET /project/:id test", function() {
    beforeEach(() => {
      sinon.stub(projectService, "get");
    });
    afterEach(() => {
      projectService.get.restore();
    });

    it("should return a post", function(done) {
      projectService.get.resolves(projectData[0]);

      request(app)
        .get("/project/5a511ff1568c490f9e0e4b4d")
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200)
        .then(res => {
          return done();
        });
    });
  });
});
