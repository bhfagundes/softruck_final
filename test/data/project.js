const Project = require("../../domain/projects/model");

module.exports.projects = [
  new Project({
    name: "None",
    department: "RH",
    status: "Aberto",
    created: "2017-08-30T08:17:50.460Z",
    _id: "5a3b9a95e9f13308a30740a5"
  }),
  new Project({
    name: "FIrst",
    department: "RH",
    status: "Fechado",
    created: "2017-08-30T08:17:50.460Z",
    _id: "5a3b9a95e9f13308a30740a5"
  }),
  new Project({
    name: "Third",
    department: "DP",
    status: "Fechado",
    created: "2017-08-30T08:17:50.460Z",
    _id: "5a3b9a95e9f13308a30740a5"
  })
];
