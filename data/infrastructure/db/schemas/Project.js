const moment = require("moment");
const mongoosePaginate = require("mongoose-paginate");

function create(mongoose) {
  const projectSchema = mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    created: Date
  });

  projectSchema.pre("save", next => {
    this.created = moment().toJSON();
    return next();
  });

  projectSchema.index({ created: -1 });

  projectSchema.plugin(mongoosePaginate);
  return mongoose.model("Project", projectSchema);
}

module.exports = create;
