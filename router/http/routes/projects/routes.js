const express = require("express");
const EndpointValidator = require("../../middleware/endpointValidator");
const asyncWrapper = require("../../utils/asyncWrapper");
const { getDefaultRequestParams } = require("../../utils/getRequestParams");

const endpointValidator = new EndpointValidator();
const router = express.Router({ mergeParams: true });

function init({ projectService }) {
  const DEFAULT_PAGINATION_LIMIT = 25;
  const MAX_PAGINATION_LIMIT = 100;
  const DEFAULT_PAGINATION_PAGE = 1;

  const handlePagination = options => {
    const populateOptionsWithPagination = Object.assign({}, options);
    if (isNaN(populateOptionsWithPagination.limit)) {
      populateOptionsWithPagination.limit = DEFAULT_PAGINATION_LIMIT;
    }
    if (isNaN(populateOptionsWithPagination.page)) {
      populateOptionsWithPagination.page = DEFAULT_PAGINATION_PAGE;
    }
    if (populateOptionsWithPagination.limit > MAX_PAGINATION_LIMIT) {
      populateOptionsWithPagination.limit = MAX_PAGINATION_LIMIT;
    }
    return populateOptionsWithPagination;
  };

  router.get(
    "/",
    asyncWrapper(async (req, res) => {
      const projectsList = await projectService.list(
        Object.assign(
          {},
          handlePagination({
            publisher: req.query.publisher,
            page: req.query.page ? parseInt(req.query.page, 10) : 1,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 25
          }),
          getDefaultRequestParams(req)
        )
      );
      return res.send(projectsList);
    })
  );

  router.post(
    "/",
    endpointValidator.requireValidPostBody,
    asyncWrapper(async (req, res) => {
      const newProject = await projectService.create(
        Object.assign(
          {
            name: req.body.projectName,
            department: req.body.department,
            status: req.body.status
          },
          getDefaultRequestParams(req)
        )
      );
      return res.send({
        data: newProject
      });
    })
  );

  router.get(
    "/:projectId",
    endpointValidator.requireValidProjectId,
    asyncWrapper(async (req, res) => {
      const projectDoc = await projectService.get(
        Object.assign(
          {
            projectId: req.params.projectId
          },
          getDefaultRequestParams(req)
        )
      );
      return res.send({
        data: projectDoc
      });
    })
  );

  router.delete(
    "/",
    asyncWrapper(async (req, res) => {
      const projectDoc = await projectService.del(
        Object.assign(
          {
            projectId: req.body.id
          },
          getDefaultRequestParams(req)
        )
      );
      return res.send({
        data: projectDoc
      });
    })
  );
  router.patch(
    "/",
    asyncWrapper(async (req, res) => {
      const newProject = await projectService.update(
        Object.assign(
          {
            id: req.body.id,
            name: req.body.projectName,
            department: req.body.department,
            status: req.body.status
          },
          getDefaultRequestParams(req)
        )
      );
      return res.send({
        data: newProject
      });
    })
  );
  return router;
}

module.exports.init = init;
