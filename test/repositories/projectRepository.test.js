const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");
const schemasFactory = require("../../data/infrastructure/db/schemas");

const schemas = schemasFactory.create(mongoose);
const db = {
  schemas
};
const { projectRepository } = require("../../data/repositories")(db);

const projectDocs = [
  {
    userId: "5a510cf183fd9d0c74898e74",
    name: "Teste",
    department: "finances",
    status: "undefined"
  },
  {
    userId: "5a510cf183fd9d0c74898e74",
    name: "Teste2",
    department: "finances",
    status: "undefined"
  },
  {
    userId: "5a5381ce26a3a8259070ae0f",
    name: "Teste3",
    department: "finances",
    status: "undefined"
  }
];

function createDbProjects(total = []) {
  return () => {
    const doc = new db.schemas.Project(projectDocs.pop());
    total.push(doc);
    if (projectDocs.length > 0) {
      return createDbProjects(total)();
    }
    return total;
  };
}

describe("project repository test", function() {
  beforeEach(() => {
    sinon.stub(db.schemas.Project, "paginate");
    sinon.stub(db.schemas.Project, "findOne");
  });

  afterEach(() => {
    db.schemas.Project.paginate.restore();
    db.schemas.Project.findOne.restore();
  });

  describe("project list method", function() {
    it("should call the db and return list of porojects", async function() {
      const projects = createDbProjects([])();
      db.schemas.Project.paginate.resolves({
        docs: projects,
        page: 1,
        limit: 15,
        pages: 1,
        total: 3
      });
      const response = await projectRepository.list({
        page: 1,
        limit: 15
      });
      expect(response.data).to.have.lengthOf(3);
      expect(response.pagination.total).to.eql(3);
      expect(response.pagination.limit).to.eql(15);
      expect(response.pagination.page).to.eql(1);
    });
  });
});
