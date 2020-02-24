const errorHandler = require("../routes/errors");
const errors = require("../../../common/errors");

module.exports = class EndpointValidator {
  constructor() {
    this._settings = {
      customValidators: {
        isInArray(item, array) {
          return array.includes(item);
        },
        isMongoObjectID(param) {
          return new RegExp("^[0-9a-fA-F]{24}$").test(param);
        },
        isTheSameUser(param, jwtUser) {
          return param === jwtUser._id;
        }
      }
    };
  }

  get settings() {
    return this._settings;
  }

  set settings(newSettings) {
    this._settings = newSettings;
  }

  requireSameUser(req, res, next) {
    req
      .checkParams("userId", "You can manage a user doc for your own user;)")
      .isTheSameUser(req.user);
    req.getValidationResult().then(result => {
      if (!result.isEmpty()) {
        return errorHandler(
          new errors.Forbidden(
            `${result.array({ onlyFirstError: true })[0].msg}`
          ),
          req,
          res,
          next
        );
      }
      return next();
    });
  }

  requireValidUserBody(req, res, next) {
    req
      .checkBody("email", "add a valid email.")
      .notEmpty()
      .isEmail();
    req.checkBody("name", "name in body required.").notEmpty();
    req.checkBody("username", "username in body required.").notEmpty();
    req.checkBody("surname", "surname in body required.").notEmpty();
    req.checkBody("password", "password in body required.").notEmpty();
    req.getValidationResult().then(result => {
      if (!result.isEmpty()) {
        return errorHandler(
          new errors.BadRequest(
            `${result.array({ onlyFirstError: true })[0].msg}`
          ),
          req,
          res,
          next
        );
      }
      return next();
    });
  }

  requireBodyParamsForLogin(req, res, next) {
    req
      .checkBody("email", "add a valid email.")
      .notEmpty()
      .isEmail();
    req.checkBody("password", "password in query required.").notEmpty();
    req.getValidationResult().then(result => {
      if (!result.isEmpty()) {
        return errorHandler(
          new errors.BadRequest(result.array({ onlyFirstError: true })[0].msg),
          req,
          res,
          next
        );
      }
      return next();
    });
  }

  requireValidProjectId(req, res, next) {
    req.checkParams("projectId", "add a valid project id.").isMongoObjectID();
    req.getValidationResult().then(result => {
      if (!result.isEmpty()) {
        return errorHandler(
          new errors.BadRequest(result.array({ onlyFirstError: true })[0].msg),
          req,
          res,
          next
        );
      }
      return next();
    });
  }

  requireValidPostBody(req, res, next) {
    req.checkBody("projectName", "name in body required.").notEmpty();
    req.checkBody("status", "status in body required.").notEmpty();
    req.checkBody("department", "department in body required.").notEmpty();
    req.getValidationResult().then(result => {
      if (!result.isEmpty()) {
        return errorHandler(
          new errors.BadRequest(
            `${result.array({ onlyFirstError: true })[0].msg}`
          ),
          req,
          res,
          next
        );
      }

      return next();
    });
  }
};
