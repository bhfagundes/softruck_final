// DATA LAYER
// postRepository:
// is used to provide an abstraction on top of the database ( and possible other data sources)
// so other parts of the application are decoupled from the specific database implementation.
// Furthermore it can hide the origin of the data from it's consumers.
// It is possible to fetch the entities from different sources like inmemory cache,
// network or the db without the need to alter the consumers code.
// I am using a factory function (using object literal and prototype) to pass methods on prototype chain
// With factory functions(closures) we can have data privacy.

const errors = require("../../../common/errors");
const mapper = require("./mapper");

const DEFAULT_PAGINATION_CONTENT = {
  pagination: {},
  data: []
};

const handleUsersPaginationResponse = response => {
  if (!response.docs || response.docs.length <= 0) {
    return DEFAULT_PAGINATION_CONTENT;
  }
  const projectsList = {
    data: response.docs.map(doc => mapper.toDomainModel(doc)),
    pagination: {
      total: response.total,
      limit: response.limit,
      page: response.page,
      pages: response.pages
    }
  };
  return projectsList;
};

const getPaginationOptions = options => ({
  lean: true,
  page: options.page || 1,
  limit: options.limit || 25,
  sort: { created: -1 }
});

const getQueryObject = options => {
  const queries = {
    userId: options.userId
  };
  if (options.publisher) {
    queries.publisher = {
      $regex: new RegExp(options.publisher),
      $options: "i"
    };
  }
  return queries;
};

const projectsStore = {
  async list(options) {
    try {
      const { Project: projectSchema } = this.getSchemas();
      const docs = await projectSchema.paginate(
        getQueryObject(options),
        getPaginationOptions(options)
      );
      return handleUsersPaginationResponse(docs);
    } catch (error) {
      throw error;
    }
  },
  async create(options) {
    try {
      const { Project: projectSchema } = this.getSchemas();
      const newProject = new projectSchema({
        userId: options.userId,
        name: options.name,
        department: options.department,
        status: options.status
      });
      const doc = await newProject.save();
      return mapper.toDomainModel(doc);
    } catch (error) {
      throw error;
    }
  },
  async get(options) {
    try {
      const { Project: projectSchema } = this.getSchemas();
      const doc = await projectSchema
        .findOne({ userId: options.userId, _id: options.projectId })
        .lean()
        .exec();
      if (!doc) {
        throw new errors.NotFound(
          `Project with id ${options.projectId} not found.`
        );
      }
      return mapper.toDomainModel(doc);
    } catch (error) {
      throw error;
    }
  },
  async del(options) {
    try {
      const { Project: projectSchema } = this.getSchemas();
      const doc = await projectSchema
        .findOne({ userId: options.userId, _id: options.projectId })
        .lean()
        .remove();
      if (!doc) {
        throw new errors.NotFound(
          `Project with id ${options.projectId} not found.`
        );
      }

      return mapper.toDomainModel(doc);
    } catch (error) {
      throw error;
    }
  },
  async update(options) {
    try {
      const { Project: projectSchema } = this.getSchemas();

      const doc = await projectSchema
        .findOneAndUpdate({ _id: options.id }, { $set: options }, { new: true })
        .lean()
        .exec();
      if (!doc) {
        throw new errors.NotFound(
          `Project with id ${options.projectId} not found.`
        );
      }
      return mapper.toDomainModel(doc);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = ({ Project }) =>
  Object.assign(Object.create(projectsStore), {
    getSchemas() {
      return {
        Project
      };
    }
  });
