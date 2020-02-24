/*
  Here is the core of our application. Here we add our business logic.
  e.g. Lets say that every time that we ask for a user, we need his posts too.
  So we add this logic in domain layer.
*/
function init({ userRepository, projectRepository }) {
  async function get(options) {
    const [user, projects] = await Promise.all([
      userRepository.get(options),
      projectRepository.list(options)
    ]);
    return {
      user,
      projects
    };
  }

  return {
    get
  };
}

module.exports = init;
