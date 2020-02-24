/**
 * This is the app Model it is decoupled from
 * the Entities used for the databse
 */
class Project {
  constructor({ _id, userId, name, status, department, created } = {}) {
    this.id = _id;
    this.userId = userId;
    this.name = name;
    this.status = status;
    this.department = department;
    this.created = created;
  }
}

module.exports = Project;
