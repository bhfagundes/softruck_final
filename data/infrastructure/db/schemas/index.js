const projectSchema = require("./Project");
const userSchema = require("./User");

module.exports.create = mongoose => ({
  Project: projectSchema(mongoose),
  User: userSchema(mongoose)
});
