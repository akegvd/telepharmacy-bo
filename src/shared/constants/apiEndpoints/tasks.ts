const tasksBaseApiUrl = "/tasks";

const tasksApiEndpoints = Object.freeze({
  list: tasksBaseApiUrl,
  detail: (id: string) => `${tasksBaseApiUrl}/${id}`,
});

export default tasksApiEndpoints;
