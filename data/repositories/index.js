const projectRepository = require("./projects/repository");
const userRepository = require("./users/repository");

module.exports = db => ({
  projectRepository: projectRepository(db.schemas),
  userRepository: userRepository(db.schemas)
});
