// Register all the services here
const projectService = require("./projects/service");
const authService = require("./auth/service");
const userService = require("./users/service");

module.exports = repositories => ({
  authService: authService(repositories),
  projectService: projectService(repositories),
  userService: userService(repositories)
});
