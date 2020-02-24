const ProjectModel = require("../../../domain/projects/model");

const toDatabase = function toDatabase(doc) {
  // TODO
};

const toDomainModel = function toDomainModel(projectDoc) {
  return new ProjectModel(projectDoc);
};

module.exports = {
  toDatabase,
  toDomainModel
};
