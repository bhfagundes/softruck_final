// DOMAIN LAYER
// Has the postRepository as a dependency. The PostService does not know
// nor does it care where the post models came from. This is abstracted away
// by the implementation of the repositories. It just calls the needed repositories
// gets the results and usually applies some business logic on them.
function init({ projectRepository }) {
  const list = async function list(options) {
    return projectRepository.list(options);
  };

  const create = async function create(options) {
    return projectRepository.create(options);
  };

  const get = async function get(options) {
    return projectRepository.get(options);
  };

  const del = async function del(options) {
    return projectRepository.del(options);
  };

  const update = async function update(options) {
    return projectRepository.update(options);
  };
  return {
    list,
    create,
    get,
    del,
    update
  };
}

module.exports = init;
